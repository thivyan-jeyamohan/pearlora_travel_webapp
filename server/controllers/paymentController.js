// Import necessary models
import Payment from '../models/Payment.js';
import PaymentMethod from '../models/PaymentMethod.js';
import Bill from '../models/Bill.js';
import User from '../models/User.js';

// @desc    Get all payments
// @route   GET /api/payments
// @access  Public
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('bill')
      .populate('user', 'email name')  // Only get email and name from user
      .populate('paymentMethod');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Public
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bill')
      .populate('user', 'name email')
      .populate('paymentMethod');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new payment
// @route   POST /api/payments
// @access  Public
export const createPayment = async (req, res) => {
  try {
    // Check if bill exists
    const bill = await Bill.findById(req.body.bill);
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: 'Bill not found'
      });
    }

    // Check if user exists
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if payment method exists
    const paymentMethod = await PaymentMethod.findById(req.body.paymentMethod);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found'
      });
    }
    
    // Validate card details for credit card payments
    if (paymentMethod.icon === 'credit-card' && (!req.body.cardDetails || !req.body.cardDetails.lastFourDigits)) {
      return res.status(400).json({
        success: false,
        error: 'Card details are required for credit card payments'
      });
    }
    
    // Create payment
    const payment = await Payment.create(req.body);

    // Update bill status to paid
    bill.status = 'Paid';
    await bill.save();

    // Populate the payment with related data
    const populatedPayment = await Payment.findById(payment._id)
      .populate('bill')
      .populate('user', 'name email')
      .populate('paymentMethod');

    res.status(201).json({
      success: true,
      data: populatedPayment
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Public
export const updatePayment = async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Check if payment method exists if it's being updated
    if (req.body.paymentMethod) {
      const paymentMethod = await PaymentMethod.findById(req.body.paymentMethod);
      
      if (!paymentMethod) {
        return res.status(404).json({
          success: false,
          error: 'Payment method not found'
        });
      }
      
      // If updating to credit card, validate card details
      if (paymentMethod.icon === 'credit-card' && (!req.body.cardDetails || !req.body.cardDetails.lastFourDigits)) {
        return res.status(400).json({
          success: false,
          error: 'Card details are required for credit card payments'
        });
      }
    }

    payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Public
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
