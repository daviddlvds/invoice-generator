import { InvoiceInputDTO } from '../../dtos/invoice-input.dto';
import { InvoiceItemType } from '../../dtos/invoice-item.dto';

export type ValidationResult = {
  detectedType: InvoiceItemType;
};

export class InvoiceValidationError extends Error {
  code = 'INVOICE_VALIDATION_ERROR';
  details: string[];

  constructor(message: string, details: string[]) {
    super(message);
    this.details = details;
  }
}

const isEmpty = (v?: string) => !v || !v.trim();
const isEmail = (v?: string) =>
  !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function validateInvoiceInput(
  invoice: InvoiceInputDTO
): ValidationResult {
  const errors: string[] = [];

  /* =========
     BODY
     ========= */
  if (!invoice) {
    throw new InvoiceValidationError('Datos requeridos', [
      'El body es obligatorio',
    ]);
  }

  /* =========
     COMPANY
     ========= */
  if (isEmpty(invoice.company?.name)) {
    errors.push('Company: name es obligatorio');
  }

  if (isEmpty(invoice.company?.website)) {
    errors.push('Company: website es obligatorio');
  }

  if (isEmpty(invoice.company?.address)) {
    errors.push('Company: address es obligatorio');
  }

  if (isEmpty(invoice.company?.zip)) {
    errors.push('Company: zip es obligatorio');
  }

  if (isEmpty(invoice.company?.country)) {
    errors.push('Company: country es obligatorio');
  }

  if (isEmpty(invoice.company?.email)) {
    errors.push('Company: email es obligatorio');
  } else if (!isEmail(invoice.company.email)) {
    errors.push('Company: email no tiene formato válido');
  }

  if (!invoice.company?.logoDataUrl?.startsWith('data:image/')) {
    errors.push('El logo de la empresa es obligatorio (logoDataUrl)');
  }


  /* =========
     CLIENT
     ========= */
  if (isEmpty(invoice.client?.name)) {
    errors.push('Client: name es obligatorio');
  }

  if (isEmpty(invoice.client?.address)) {
    errors.push('Client: address es obligatorio');
  }

  if (isEmpty(invoice.client?.cityStateZip)) {
    errors.push('Client: cityStateZip es obligatorio');
  }

  if (isEmpty(invoice.client?.country)) {
    errors.push('Client: country es obligatorio');
  }

  if (isEmpty(invoice.client?.email)) {
    errors.push('Client: email es obligatorio');
  } else if (!isEmail(invoice.client.email)) {
    errors.push('Client: email no tiene formato válido');
  }

  /* =========
     META
     ========= */
  if (isEmpty(invoice.meta?.invoiceNumber)) {
    errors.push('Meta: invoiceNumber es obligatorio');
  }

  if (!invoice.meta?.invoiceDate) {
    errors.push('Meta: invoiceDate es obligatorio');
  }

  if (!invoice.meta?.dueDate) {
    errors.push('Meta: dueDate es obligatorio');
  }

  /* =========
     NOTES
     ========= */
  if (isEmpty(invoice.notes)) {
    errors.push('Notes es obligatorio');
  }

  /* =========
     ITEMS
     ========= */
  if (!Array.isArray(invoice.items) || invoice.items.length === 0) {
    errors.push('Debe existir al menos un item en la factura');
  }

  let detectedType: InvoiceItemType | null = null;

  invoice.items?.forEach((item, index) => {
    const prefix = `Item ${index + 1}`;

    if (!item.type) {
      errors.push(`${prefix}: type es obligatorio`);
    }

    if (isEmpty(item.description)) {
      errors.push(`${prefix}: description es obligatoria`);
    }

    if (!(item.quantity > 0)) {
      errors.push(`${prefix}: quantity debe ser mayor a 0`);
    }

    if (item.unitPrice <= 0) {
      errors.push(`${prefix}: unitPrice debe ser mayor a 0`);
    }

    if (item.discount < 0) {
      errors.push(`${prefix}: discount no puede ser negativo`);
    }

    if (item.taxRate < 0 || item.taxRate > 1) {
      errors.push(`${prefix}: taxRate debe estar entre 0 y 1`);
    }


    if (item.type) {
      if (!detectedType) {
        detectedType = item.type;
      } else if (detectedType !== item.type) {
        errors.push(
          'No se pueden mezclar productos y servicios en la misma factura'
        );
      }
    }
  });

  if (errors.length) {
    throw new InvoiceValidationError('Validación fallida', errors);
  }

  return { detectedType: detectedType! };
}
