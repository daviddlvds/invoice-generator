import { InvoiceInputDTO } from '../dtos/invoice-input.dto';

const s = (v: any) => (typeof v === 'string' ? v.trim() : '');
const n = (v: any, def = 0) => {
  const num = Number(v);
  return Number.isFinite(num) ? num : def;
};

export function normalizeInvoice(input: InvoiceInputDTO): { normalized: InvoiceInputDTO } {
  const normalized: InvoiceInputDTO = {
    company: {
      name: s(input?.company?.name),
      website: s(input?.company?.website),
      address: s(input?.company?.address),
      zip: s(input?.company?.zip),
      country: s(input?.company?.country),
      email: s(input?.company?.email),
      logoDataUrl: s(input?.company?.logoDataUrl),
    },
    client: {
      name: s(input?.client?.name),
      address: s(input?.client?.address),
      cityStateZip: s(input?.client?.cityStateZip),
      country: s(input?.client?.country),
      email: s(input?.client?.email),
    },
    meta: {
      invoiceNumber: s(input?.meta?.invoiceNumber),
      invoiceDate: s(input?.meta?.invoiceDate),
      dueDate: s(input?.meta?.dueDate),
      currency: s(input?.meta?.currency),
    },
    notes: s(input?.notes),
    items: Array.isArray(input?.items)
      ? input.items.map((item) => ({
          type: item?.type,
          description: s(item?.description),
          quantity: n(item?.quantity, 0),
          unitPrice: n(item?.unitPrice, 0),
          discount: n(item?.discount, 0),
          taxRate: n(item?.taxRate, 0),
        }))
      : [],
  };

  return { normalized };
}
