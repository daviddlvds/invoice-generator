export type InvoiceItemType = 'PRODUCT' | 'SERVICE';

export interface InvoiceItem {
  type: InvoiceItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface InvoiceInput {
  company: {
    name: string;
    contactName: string;
    website: string;
    address: string;
    zip: string;
    country: string;
    email: string;
  };
  client: {
    name: string;
    address: string;
    cityStateZip: string;
    country: string;
    email: string;
  };
  meta: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
  };
  notes: string;
  items: InvoiceItem[];
}

export interface InvoiceTotals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}

export interface InvoicePreview {
  detectedType: InvoiceItemType;
  totals: InvoiceTotals;
}


export interface CompanyInfo {
  name: string;
  address: string;
  website?: string;
  email?: string;
  country?: string;
  zip?: string;
}

export interface ClientInfo {
  name: string;
  address?: string;
  cityStateZip?: string;
  country?: string;
  email?: string;
}

export interface InvoiceMeta {
  invoiceNumber?: string;
  invoiceDate: string;
  dueDate: string;
}
