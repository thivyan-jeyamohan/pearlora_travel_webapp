import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BillSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Flight Booking',
      'Hotel Reservation',
      'Package Tour',
      'Transportation',
      'Travel Insurance',
      'Visa Services',
      'Excursions',
      'Cruise Booking',
      'Car Rental',
      'Travel Consultation'
    ]
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Bill = model('Bill', BillSchema);
export default Bill;
