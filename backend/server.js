const express = require('express');
const app = express();
const fs = require('fs');
const transitRouter = require('./routes/transit'); // Import your transit router
const cors = require('cors'); // Import the cors middleware

// Use the cors middleware to enable CORS
app.use(cors());
// Read and parse the stops.txt file
const stopsData = {};


fs.readFile('data/stops.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const lines = data.split('\n');
  for (const line of lines) {
    const [stop_id, stop_name, stop_lat, stop_lon, location_type, parent_station] = line.split(',');
    if (parent_station) {
      // If there is a parent station, map the child stop ID to the parent station's name
      stopsData[stop_id] = stopsData[parent_station];
    } else {
      // Otherwise, just map the stop ID to its name
      stopsData[stop_id] = stop_name;
    }
  }
  console.log('Stops data loaded:', stopsData);
});


// Create an API endpoint to send stops data as JSON
app.get('/api/stops', (req, res) => {
  console.log('Sending Stops Data:', JSON.stringify(stopsData));
  res.setHeader('Content-Type', 'application/json');
  res.json(stopsData);
});


// Use the transit router for /transit routes
app.use('/transit', transitRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

