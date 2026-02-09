import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceInput, InvoicePreview } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private baseUrl = 'http://localhost:3001/api/invoices';

  constructor(private http: HttpClient) {}

  previewInvoice(payload: InvoiceInput): Observable<InvoicePreview> {
    return this.http.post<InvoicePreview>(`${this.baseUrl}/preview`, payload);
  }

  generatePdf(payload: InvoiceInput): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/pdf`, payload, { responseType: 'blob' });
  }
}
