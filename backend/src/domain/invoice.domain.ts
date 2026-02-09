import { InvoiceInputDTO } from '../dtos/invoice-input.dto';
import { InvoiceTotalsDTO } from '../dtos/invoice-preview.dto';
import { InvoiceItemType } from '../dtos/invoice-item.dto';

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateTotals(invoiceDto: InvoiceInputDTO, detectedType: InvoiceItemType): InvoiceTotalsDTO {

  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;

  for (const item of invoiceDto.items) {
    const base = item.quantity * item.unitPrice;
    const discount = Math.min(item.discount, base);
    const rate = item.taxRate;

    subtotal += base;

    if (detectedType === 'SERVICE') {
      // SERVICE: descuento antes del impuesto
      discountTotal += discount;
      taxTotal += (base - discount) * rate;
    } else {
      // PRODUCT: descuento después del impuesto
      taxTotal += base * rate;
      discountTotal += discount;
    }
  }

  subtotal = round2(subtotal);
  discountTotal = round2(discountTotal);
  taxTotal = round2(taxTotal);

  const total =
    detectedType === 'SERVICE'
      ? round2(subtotal - discountTotal + taxTotal)
      : round2(subtotal + taxTotal - discountTotal);

  console.log('[domain] calculateTotals - end', { subtotal, discountTotal, taxTotal, total });

  return { subtotal, discountTotal, taxTotal, total };
}
