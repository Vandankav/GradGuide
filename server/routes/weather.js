const express = require("express");
const router = express.Router();
const { getWeatherData } = require("../services/weatherService");

// Get current weather for a destination
router.get("/current/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const weather = await getWeatherData(city);

    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch weather data",
      message: error.message,
    });
  }
});

// Get weather forecast for a destination
router.get("/forecast/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const { days = 5 } = req.query;

    const forecast = await getWeatherData(city, parseInt(days));

    res.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch weather forecast",
      message: error.message,
    });
  }
});

module.exports = router;
