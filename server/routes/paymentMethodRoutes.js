import express from 'express';
import {
  getPaymentMethods,
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} from '../controllers/paymentMethodController.js';  // Importing ES module exports

const router = express.Router();

router
  .route('/')
  .get(getPaymentMethods)
  .post(createPaymentMethod);

router
  .route('/:id')
  .get(getPaymentMethod)
  .put(updatePaymentMethod)
  .delete(deletePaymentMethod);

export default router;
