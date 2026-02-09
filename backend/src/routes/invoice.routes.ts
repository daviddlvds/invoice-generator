import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller';

const router = Router();

console.log('[routes] invoice.routes loaded');

router.post('/preview', invoiceController.postPreview);
router.post('/pdf', invoiceController.postPdf);


export default router;
