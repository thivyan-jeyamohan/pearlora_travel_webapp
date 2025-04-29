import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
  bill: {
    type: Schema.Types.ObjectId,
    ref: 'Bill',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  billingAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },
  cardHolderName: String,
  cardDetails: {
    lastFourDigits: String,
    expiryMonth: String,
    expiryYear: String,
    cardType: String // visa, mastercard, etc.
  },
  email: String,
  phoneNumber: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a transaction ID before saving
PaymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId =
      Date.now().toString() +
      Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

const Payment = model('Payment', PaymentSchema);
export default Payment;
