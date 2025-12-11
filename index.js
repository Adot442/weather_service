import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get("/coords", async (req, res) => {
  try {
    const zip = req.query.zip;

    console.log(zip)
    if (!zip) {
      return res.status(400).json({ error: "ZIP code is required" });
    }

    const url = `https://api.zippopotam.us/us/${zip}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(response);
    console.log("data: ", data);
    console.log("places: ", data.places, data.places.length);

    if (!data.places || data.places.length === 0) {
      return res.status(404).json({ error: "ZIP code not found" });
    }

    const { latitude, longitude, state } = data.places[0];

    res.json({ zip, state: state, latitude, longitude });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Geocoding request failed" });
  }
});


app.get("/weather", async (req, res) => {
  try {
    const latitude = req.query.lat || 40.7128;
    const longitude = req.query.lon || -74.0060;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.current_weather);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Open-Meteo data" });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

