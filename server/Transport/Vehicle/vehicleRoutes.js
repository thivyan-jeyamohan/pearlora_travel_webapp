import express from 'express';
import Vehicle from './Vehicle.js';

const router = express.Router();

// Add new vehicle
router.post('/', async (req, res) => {
  try {
    const { vehicleName, serialId, price } = req.body;

    const newVehicle = new Vehicle({
      vehicleName,
      serialId,
      price
    });

    await newVehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});


// Update only the price
router.put('/:id', async (req, res) => {
    try {
      const { price } = req.body;
      const { id } = req.params;
  
      const updated = await Vehicle.findByIdAndUpdate(id, { price }, { new: true });
  
      if (!updated) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
  
      res.status(200).json({ message: 'Price updated successfully', vehicle: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update price' });
    }
  });
  

export default router;
