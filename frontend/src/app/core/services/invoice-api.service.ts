import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceInput, InvoicePreview } from '../models/invoice.model';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  previewInvoice(payload: InvoiceInput): Observable<InvoicePreview> {
    return this.http.post<InvoicePreview>(`${this.baseUrl}/invoices/preview`, payload);
  }

  generatePdf(payload: InvoiceInput): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/invoices/pdf`, payload, { responseType: 'blob' });
  }
}
