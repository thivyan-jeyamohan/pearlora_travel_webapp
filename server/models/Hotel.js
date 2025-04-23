import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    hotelId: {type: String,required: true,unique: true,index: true},
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    availabilityStatus: { type: Boolean, default: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    coverPhoto: { type: String, required: true },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;