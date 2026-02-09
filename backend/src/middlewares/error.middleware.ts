import type { Request, Response, NextFunction } from 'express';
import { ErrorResponseDTO } from '../dtos/error-response.dto';
import { InvoiceValidationError } from '../domain/validators/invoice.validator';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[middlewares/error] caught:', err);

  if (err instanceof InvoiceValidationError) {
    const payload: ErrorResponseDTO = {
      message: err.message,
      code: err.code,
      details: err.details,
    };
    return res.status(400).json(payload);
  }

  const payload: ErrorResponseDTO = {
    message: 'Error interno del servidor',
    code: 'INTERNAL_ERROR',
  };

  return res.status(500).json(payload);
}
