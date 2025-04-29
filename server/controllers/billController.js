import Bill from '../models/Bill.js';

// @desc    Get all bills
// @route   GET /api/bills
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('userId', 'name email');
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
export const getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email phoneNumber',
      });

    if (!bill) {
      return res.status(404).json({ success: false, error: 'Bill not found' });
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get bills by user
// @route   GET /api/bills/user/:userId
export const getUserBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.params.userId }).populate(
      'userId',
      'name email'
    );
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create bill
// @route   POST /api/bills
export const createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
export const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bill) {
      return res.status(404).json({ success: false, error: 'Bill not found' });
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, error: 'Bill not found' });
    }
    await bill.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get bills by category
// @route   GET /api/bills/category/:category
export const getBillsByCategory = async (req, res) => {
  try {
    const bills = await Bill.find({ category: req.params.category }).populate(
      'userId',
      'name email'
    );
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
