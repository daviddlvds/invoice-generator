import { Component, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceApiService } from '../../core/services/invoice-api.service';
import { InvoiceInput, InvoicePreview } from '../../core/models/invoice.model';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  catchError,
  of,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-invoice-page',
  imports: [InvoiceFormComponent],
  template: `
    <app-invoice-form
      (invoiceChange)="onInvoiceChange($event)">
    </app-invoice-form>
  `,
})
export class InvoicePageComponent implements OnDestroy {
  preview?: InvoicePreview;
  error?: string;

  public lastInvoice?: InvoiceInput;
  private invoiceChanges$ = new Subject<InvoiceInput>();

  private platformId = inject(PLATFORM_ID);

  constructor(private invoiceApi: InvoiceApiService) {
    this.invoiceChanges$
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        switchMap(input =>
          this.invoiceApi.previewInvoice(input).pipe(
            catchError(err => {
              this.error =
                err?.error?.message || 'Error generating preview';
              this.preview = undefined;
              return of(null);
            })
          )
        )
      )
      .subscribe(result => {
        if (result) {
          this.preview = result;
          this.error = undefined;
        }
      });
  }

  onInvoiceChange(invoice: InvoiceInput) {
    this.lastInvoice = invoice;
    this.invoiceChanges$.next(invoice);
  }

  generatePdf() {
    if (!this.lastInvoice) return;

    this.invoiceApi.generatePdf(this.lastInvoice).subscribe(blob => {
      if (isPlatformBrowser(this.platformId)) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  ngOnDestroy(): void {
    this.invoiceChanges$.complete();
  }
}
