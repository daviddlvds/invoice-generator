import { InvoiceItemDTO } from './invoice-item.dto';

export interface InvoiceCompanyDTO {
  name: string;
  website: string;
  address?: string;
  zip?: string;
  country?: string;
  email?: string;
  logoDataUrl?: string;
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

export interface InvoiceInputDTO {
  company: InvoiceCompanyDTO;
  client: InvoiceClientDTO;
  meta: InvoiceMetaDTO;
  items: InvoiceItemDTO[];
  notes?: string;
}
