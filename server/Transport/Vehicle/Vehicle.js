import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleName: { type: String, required: true },
  serialId: { type: String, required: true, unique: true },
  price: { type: Number, required: true }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
