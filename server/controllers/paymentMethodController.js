import PaymentMethod from '../models/PaymentMethod.js';
import Payment from '../models/Payment.js';

// @desc    Get all payment methods
// @route   GET /api/payment-methods
// @access  Public
export const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    
    res.status(200).json({
      success: true,
      count: paymentMethods.length,
      data: paymentMethods
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single payment method
// @route   GET /api/payment-methods/:id
// @access  Public
export const getPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found'
      });
    }

    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new payment method
// @route   POST /api/payment-methods
// @access  Public
export const createPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.create(req.body);

    res.status(201).json({
      success: true,
      data: paymentMethod
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Payment method with that name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update payment method
// @route   PUT /api/payment-methods/:id
// @access  Public
export const updatePaymentMethod = async (req, res) => {
  try {
    let paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found'
      });
    }

    paymentMethod = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: paymentMethod
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Payment method with that name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payment-methods/:id
// @access  Public
export const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        error: 'Payment method not found'
      });
    }

    // Check if the payment method is being used in any payments
    const paymentCount = await Payment.countDocuments({ paymentMethod: req.params.id });
    
    if (paymentCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete payment method as it is used in ${paymentCount} payment(s)`
      });
    }

    await paymentMethod.deleteOne();

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
