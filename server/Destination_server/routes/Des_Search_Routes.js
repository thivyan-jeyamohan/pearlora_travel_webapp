// Server-side route to handle the search query
app.get('/api/destinations/search', async (req, res) => {
    const query = req.query.q || ''; // Get the search query (e.g., "C" for Colombo)
    try {
      const results = await Destination.find({
        name: { $regex: query, $options: 'i' }, // Case-insensitive search by name
      });
      res.json(results); // Return the matching destinations
    } catch (err) {
      res.status(500).json({ error: 'Error fetching destinations' });
    }
  });
  