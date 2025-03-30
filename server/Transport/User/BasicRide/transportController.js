import RideBooking from "./BasicRideBooking.js";

// 📌 Create a new ride booking
export const createRideBooking = async (req, res) => {
  try {
    const newBooking = new RideBooking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Booking successful!" });
  } catch (error) {
    res.status(500).json({ error: "Error creating ride booking" });
  }
};

// 📌 Get all ride bookings
export const getRideBookings = async (req, res) => {
  try {
    const rides = await RideBooking.find();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving rides" });
  }
};

// 📌 Delete a ride booking by ID
export const deleteRideBooking = async (req, res) => {
  try {
    const deletedRide = await RideBooking.findByIdAndDelete(req.params.id);
    if (!deletedRide) {
      return res.status(404).json({ error: "Ride not found" });
    }
    res.json({ message: "Ride deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ride" });
  }
};

// 📌 Update a ride booking by ID
export const updateRideBooking = async (req, res) => {
  try {
    const updatedRide = await RideBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedRide) {
      return res.status(404).json({ error: "Ride not found" });
    }
    res.json(updatedRide);
  } catch (error) {
    res.status(500).json({ error: "Error updating ride" });
  }
};
