# Invoice Generator — Frontend (Angular SSR)

Este repositorio contiene el **frontend** de la prueba técnica **Invoice Generator**, desarrollado con **Angular 21** utilizando **SSR (Server Side Rendering)**.
El objetivo principal es capturar información de una factura, validarla correctamente y comunicarse con el backend para **previsualizar totales** y **generar el PDF**.

---

## 🎯 Objetivo de la prueba técnica (Frontend)

El frontend debe:

- Capturar toda la información necesaria para una factura.
- Validar **todos los campos como obligatorios** antes de permitir acciones.
- **No calcular totales localmente**.
- Consumir el backend como fuente única de verdad:
  - `POST /preview` → validación + totales
  - `POST /pdf` → generación del PDF
- Mostrar mensajes de error claros provenientes del backend.
- Deshabilitar acciones cuando el formulario sea inválido.

---

## 🧱 Stack tecnológico

- **Angular 21**
- **Angular SSR** (`@angular/ssr`)
- Standalone Components
- Reactive Forms
- RxJS
- Express (solo como servidor SSR)

---

## 📋 Funcionalidades implementadas

### 1. Formulario de factura
Incluye los siguientes grupos:

#### Company
- name
- website
- address
- zip
- country
- email
- logo (imagen enviada al backend como base64 / URL)

#### Client
- name
- address
- cityStateZip
- country
- email

#### Meta
- invoiceNumber
- invoiceDate
- dueDate
- currency (opcional)

#### Items
- type (`SERVICE` | `PRODUCT`)
- description
- quantity
- unitPrice
- discount
- taxRate

#### Notes
- Texto libre (obligatorio)

👉 **Todos los campos son obligatorios** según lo solicitado en la prueba.

---

### 2. Validación

- Validación inmediata con `ReactiveForms`
- Mensajes por campo (required, email, min, max)
- El botón **Generate Invoice PDF**:
  - Se deshabilita si el formulario es inválido
  - Se deshabilita si el backend devuelve error

---

### 3. Preview automático

- Cada cambio del formulario dispara un `valueChanges`
- Se usa `debounceTime` para evitar múltiples requests
- El frontend solo muestra los totales devueltos por el backend
- Se llama al backend:

```http
POST /api/invoices/preview
```
### 4. Manejo de errores del backend

Si el backend responde con error (400):
- Se muestra un banner superior con:
    - message
    - Lista de details
- El usuario entiende exactamente qué debe corregir.
- Los totales se limpian automáticamente para evitar inconsistencias.
- El botón de generación de PDF se deshabilita.

### 5. Generación y descarga del PDF

Al presionar Generate Invoice PDF:
1. Se envía el formulario completo al backend.
2. Se llama al endpoint:
```
POST /api/invoices/pdf
```
3. El frontend recibe un Blob.
4. Se descarga automáticamente el archivo:
```
invoice.pdf
```
El frontend no renderiza ni genera PDFs.

---

🔌 Contrato con el backend

El frontend asume únicamente estos endpoints:
* POST /api/invoices/preview
* POST /api/invoices/pdf

El frontend NO:
* Calcula totales
* Decide reglas de negocio
* Genera PDFs

Todo esto pertenece exclusivamente al backend, tal como exige la prueba técnica.

---


🚀 Instalación
```
npm install
```

▶️ Ejecución
Desarrollo
```
npm run start
```
SSR (modo recomendado)
```
npm run build
npm run serve:ssr
```

---

🧪 Consideraciones importantes de la prueba

✔ Separación clara de responsabilidades (frontend vs backend)

✔ Validación consistente entre frontend y backend

✔ UX clara ante errores

✔ Flujo completo: capturar → validar → preview → PDF

✔ SSR configurado y funcional

✔ Código legible y estructurado

---

### 📄 Nota final

Este frontend está diseñado exclusivamente para cumplir los requerimientos de la prueba técnica, priorizando claridad, robustez y alineación con buenas prácticas profesionales.