import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceInput, InvoicePreview } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private baseUrl = process.env['API_BASE_URL'] || 'https://invoice-generator-production-b22a.up.railway.app/api';

  constructor(private http: HttpClient) {}

  previewInvoice(payload: InvoiceInput): Observable<InvoicePreview> {
    return this.http.post<InvoicePreview>(`${this.baseUrl}/invoices/preview`, payload);
  }

  generatePdf(payload: InvoiceInput): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/invoices/pdf`, payload, { responseType: 'blob' });
  }
}
