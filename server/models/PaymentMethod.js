import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PaymentMethodSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a payment method name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  processingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  icon: {
    type: String,
    default: 'credit-card'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PaymentMethod = model('PaymentMethod', PaymentMethodSchema);
export default PaymentMethod;
