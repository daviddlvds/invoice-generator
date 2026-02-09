import { InvoicePreviewInputDTO } from './invoice-preview-input.dto';
import { InvoiceItemType } from './invoice-item.dto';

export interface InvoiceTotalsDTO {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}

export interface InvoicePreviewDTO {
  normalized: InvoicePreviewInputDTO;
  detectedType: InvoiceItemType;
  totals: InvoiceTotalsDTO;
}
