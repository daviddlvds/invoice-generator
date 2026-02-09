import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  switchMap,
  tap,
  catchError,
} from 'rxjs';
import { InvoiceApiService } from '../../../core/services/invoice-api.service';
import {
  InvoiceTotals,
  InvoiceInput,
  InvoiceItemType,
  InvoicePreview,
} from '../../../core/models/invoice.model';
import { ApiError } from '../../../core/models/api-error.model';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css'],
})
export class InvoiceFormComponent {
  @Output() invoiceChange = new EventEmitter<InvoiceInput>();

  form: FormGroup;

  totals: InvoiceTotals = {
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    total: 0,
  };

  apiErrorMessage: string | null = null;
  apiErrorDetails: string[] = [];
  companyLogoDataUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceApi: InvoiceApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      company: this.fb.group({
        name: ['', Validators.required],
        website: ['', Validators.required],
        address: ['', Validators.required],
        zip: ['', Validators.required],
        country: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        logoDataUrl: ['', Validators.required],
      }),

      client: this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        cityStateZip: ['', Validators.required],
        country: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }),

      meta: this.fb.group({
        invoiceNumber: ['', Validators.required],
        invoiceDate: [this.today(), Validators.required],
        dueDate: [this.today(), Validators.required],
      }),

      notes: ['', Validators.required],
      items: this.fb.array([]),
    });

    this.addItem();

    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) this.invoiceChange.emit(this.form.getRawValue());
    });

    this.form.valueChanges
      .pipe(
        startWith(this.form.getRawValue()),
        debounceTime(350),

        map(() => this.buildPreviewPayloadOrNull()),

        map((payload) => ({ payload, key: payload ? JSON.stringify(payload) : null })),
        distinctUntilChanged((a, b) => a.key === b.key),

        tap(({ payload }) => {
          if (!payload) {
            this.clearApiError();
            this.resetTotals();
          }
        }),

        filter(({ payload }) => !!payload),

        switchMap(({ payload }) =>
          this.invoiceApi.previewInvoice(payload!).pipe(
            tap(() => this.clearApiError()),
            catchError((err) => {
              this.setApiError(err);
              this.resetTotals();
              return of(null);
            })
          )
        ),

        filter((res): res is InvoicePreview => res !== null)
      )
      .subscribe((res) => {
        this.totals = res.totals;
        this.cdr.markForCheck();
      });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const item = this.fb.group({
      type: ['SERVICE' as InvoiceItemType, Validators.required],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      taxRate: [0.16, [Validators.required, Validators.min(0), Validators.max(1)]],
    });

    this.items.push(item);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  previewInvoice(): void {
    const payload = this.buildPreviewPayloadOrNull();

    if (!payload) {
      this.form.markAllAsTouched();
      this.resetTotals();
      return;
    }

    this.invoiceApi.previewInvoice(payload).subscribe({
      next: (res) => {
        this.clearApiError();
        this.totals = res.totals;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.setApiError(err);
        this.resetTotals();
      },
    });
  }

  generatePdf(): void {
    this.apiErrorMessage = null;
    this.apiErrorDetails = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: InvoiceInput = this.form.getRawValue();

    this.invoiceApi.generatePdf(payload).subscribe({
      next: (blob) => {
        const inv = payload?.meta?.invoiceNumber?.trim() || 'invoice';
        const fileName = `${inv}.pdf`;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.setApiError(err);
      }
    });
  }



  private today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private buildPreviewPayloadOrNull(): InvoiceInput | null {
    const validItems = this.getValidItems();

    if (validItems.length === 0) return null;

    const payload: InvoiceInput = {
      company: this.form.value.company,
      client: this.form.value.client,
      meta: this.form.value.meta,
      notes: this.form.value.notes,
      items: validItems,
    };

    return payload;
  }

  private getValidItems(): any[] {
    return this.items.controls
      .map((ctrl) => ctrl.value)
      .filter((item) => {
        if (!item) return false;
        if (!String(item.description ?? '').trim()) return false;
        if (!(Number(item.quantity) > 0)) return false;
        if (!(Number(item.unitPrice) > 0)) return false;

        if (item.discount === null || item.discount === undefined) return false;
        if (item.taxRate === null || item.taxRate === undefined) return false;

        return true;
      })
      .map((item) => ({
        ...item,
        description: String(item.description).trim(),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        taxRate: Number(item.taxRate),
      }));
  }

  isInvalid(path: string): boolean {
    const control = this.form.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private resetTotals(): void {
    this.totals = { subtotal: 0, discountTotal: 0, taxTotal: 0, total: 0 };
  }

  private clearApiError(): void {
    this.apiErrorMessage = null;
    this.apiErrorDetails = [];
  }

  private setApiError(err: unknown): void {
    this.apiErrorMessage = 'Ocurrió un error';
    this.apiErrorDetails = [];

    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiError | string | null;

      if (body && typeof body === 'object') {
        this.apiErrorMessage = body.message ?? `Error ${err.status}`;
        this.apiErrorDetails = Array.isArray(body.details) ? body.details : [];
        return;
      }

      if (typeof body === 'string') {
        this.apiErrorMessage = body || `Error ${err.status}`;
        return;
      }

      this.apiErrorMessage = err.message || `Error ${err.status}`;
      return;
    }

    if (err && typeof err === 'object' && 'message' in err) {
      this.apiErrorMessage = String((err as any).message);
    }
  }

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.apiErrorMessage = 'El logo debe ser una imagen.';
      this.apiErrorDetails = [];
      return;
    }

    const maxBytes = 1_000_000;
    if (file.size > maxBytes) {
      this.apiErrorMessage = 'El logo es demasiado pesado (máx 1MB).';
      this.apiErrorDetails = [];
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      this.companyLogoDataUrl = dataUrl;

      this.form.get('company.logoDataUrl')?.setValue(dataUrl);
      this.form.get('company.logoDataUrl')?.markAsDirty();
      this.form.get('company.logoDataUrl')?.updateValueAndValidity();
    };

    reader.readAsDataURL(file);
  }

  clearLogo(): void {
    this.companyLogoDataUrl = null;
    this.form.get('company.logoDataUrl')?.setValue('');
    this.form.get('company.logoDataUrl')?.markAsDirty();
  }

}
