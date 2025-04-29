import express from 'express';
import {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
} from '../controllers/paymentController.js';

const router = express.Router();

router
  .route('/')
  .get(getPayments)
  .post(createPayment);

router
  .route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

export default router;
