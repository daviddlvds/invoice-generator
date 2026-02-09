import { Request, Response, NextFunction } from 'express';
import { InvoiceInputDTO } from '../dtos/invoice-input.dto';
import * as invoiceService from '../services/invoice.service';

export function postPreview(req: Request, res: Response, next: NextFunction) {
  console.log('[controller] postPreview - start');

  try {
    const dto = req.body as InvoiceInputDTO;

    console.log('[controller] postPreview - items:', dto?.items?.length);

    const result = invoiceService.previewInvoice(dto);

    console.log('[controller] postPreview - end');
    return res.status(200).json(result);
  } catch (err) {
    console.log('[controller] postPreview - error');
    return next(err);
  }
}


export async function postPdf(req: Request, res: Response, next: NextFunction) {
  console.log('[controller] postPdf - start');

  try {
    const dto = req.body as InvoiceInputDTO;

    const pdfBuffer = await invoiceService.generateInvoicePdf(dto);

    const invoiceNumber = dto?.meta?.invoiceNumber || 'invoice';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoiceNumber}.pdf"`
    );
    res.setHeader('Content-Length', String(pdfBuffer.length));
    res.setHeader('Cache-Control', 'no-store');

    console.log('[controller] postPdf - success, sending PDF');
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.log('[controller] postPdf - error');
    return next(error);
  }
}
