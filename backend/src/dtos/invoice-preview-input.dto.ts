import { InvoiceItemDTO, InvoiceItemType } from './invoice-item.dto';

export interface InvoiceCompanyDTO {
  name: string;
  contactName?: string;
  website?: string;
  address?: string;
  zip?: string;
  country?: string;
  email?: string;
  logoUrl?: string;
}

export interface InvoiceClientDTO {
  name: string;
  address?: string;
  cityStateZip?: string;
  country?: string;
  email?: string;
}

export interface InvoiceMetaDTO {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency?: string;
}

export interface InvoicePreviewInputDTO {
  company: InvoiceCompanyDTO;
  client: InvoiceClientDTO;
  meta: InvoiceMetaDTO;
  notes?: string;
  items: InvoiceItemDTO[];
}
