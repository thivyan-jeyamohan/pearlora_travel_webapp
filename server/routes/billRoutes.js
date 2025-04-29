import express from 'express';
import {
  getBills,
  getBill,
  getUserBills,
  createBill,
  updateBill,
  deleteBill,
  getBillsByCategory,
} from '../controllers/billController.js';

const router = express.Router();

// Get all bills and create new bill
router
  .route('/')
  .get(getBills)
  .post(createBill);

// Get bills by category
router.route('/category/:category').get(getBillsByCategory);

// Get bills for specific user
router.route('/user/:userId').get(getUserBills);

// Get, update, and delete specific bill
router
  .route('/:id')
  .get(getBill)
  .put(updateBill)
  .delete(deleteBill);

export default router;
