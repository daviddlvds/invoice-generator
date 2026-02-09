import { InvoiceInputDTO } from '../dtos/invoice-input.dto';
import { InvoicePreviewDTO } from '../dtos/invoice-preview.dto';
import { validateInvoiceInput } from '../domain/validators/invoice.validator';
import { calculateTotals } from '../domain/invoice.domain';
import { generatePdfFromTemplate } from '../infrastructure/pdf/pdf.service';
import { normalizeInvoice } from '../domain/normalize-invoice';

export function previewInvoice(invoiceDto: InvoiceInputDTO): InvoicePreviewDTO {
  console.log('[service] previewInvoice - start');

  const { normalized } = normalizeInvoice(invoiceDto);

  const { detectedType } = validateInvoiceInput(normalized);

  const totals = calculateTotals(normalized, detectedType);

  console.log('[service] previewInvoice - end');

  return {
    normalized,
    detectedType,
    totals,
  };
}

export async function generateInvoicePdf(dto: InvoiceInputDTO): Promise<Buffer> {
  console.log('[service] generateInvoicePdf - start');

  const preview = previewInvoice(dto);

  const invoiceNumber = preview.normalized?.meta?.invoiceNumber || 'invoice';

  const itemsForTemplate = preview.normalized.items.map((it) => {
    const qty = Number(it.quantity);
    const unit = Number(it.unitPrice);
    const discount = Number(it.discount ?? 0);
    const taxRate = Number(it.taxRate ?? 0);

    const base = qty * unit;

    const taxableBase = preview.detectedType === 'SERVICE' ? (base - discount) : base;
    const tax = taxableBase * taxRate;

    const lineTotal =
      preview.detectedType === 'SERVICE'
          ? (base - discount) + tax
          : (base + tax) - discount;

    return {
      ...it,
      lineTotal: Number(lineTotal.toFixed(2)),
    };
  });


  const pdf = await generatePdfFromTemplate('invoices/invoice.html', {
    ...preview.normalized,
    detectedType: preview.detectedType,
    totals: preview.totals,
    createdAt: new Date().toISOString(),
    items: itemsForTemplate,
    company: {
      ...dto.company,
      logoUrl: dto.company.logoDataUrl
    }
  });

  console.log('[service] generateInvoicePdf - end', { invoiceNumber });

  return pdf;
}
