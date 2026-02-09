export type InvoiceItemType = 'PRODUCT' | 'SERVICE';

export interface InvoiceItemDTO {
  type: InvoiceItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}
