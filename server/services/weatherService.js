const axios = require("axios");

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Get current weather data
async function getWeatherData(city, days = 1) {
  try {
    if (!OPENWEATHER_API_KEY) {
      console.warn("OpenWeather API key not provided, returning mock data");
      return getMockWeatherData(city, days);
    }

    if (days === 1) {
      // Current weather
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      });

      return {
        city: response.data.name,
        country: response.data.sys.country,
        temperature: Math.round(response.data.main.temp),
        feelsLike: Math.round(response.data.main.feels_like),
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
        visibility: response.data.visibility / 1000, // Convert to km
        timestamp: new Date().toISOString(),
      };
    } else {
      // Weather forecast
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
          cnt: days * 8, // 8 forecasts per day (every 3 hours)
        },
      });

      // Group forecasts by day
      const dailyForecasts = {};
      response.data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date: date,
            forecasts: [],
          };
        }
        dailyForecasts[date].forecasts.push({
          time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        });
      });

      return {
        city: response.data.city.name,
        country: response.data.city.country,
        forecasts: Object.values(dailyForecasts),
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error(`Weather API error for ${city}:`, error.message || error);
    // Return mock data if API fails
    return getMockWeatherData(city, days);
  }
}

// Mock weather data for development/demo purposes
function getMockWeatherData(city, days = 1) {
  const mockTemperatures = [22, 25, 18, 28, 20, 24, 26, 19];
  const mockDescriptions = [
    "clear sky",
    "few clouds",
    "scattered clouds",
    "broken clouds",
    "shower rain",
    "rain",
    "thunderstorm",
    "snow",
  ];

  if (days === 1) {
    const randomTemp =
      mockTemperatures[Math.floor(Math.random() * mockTemperatures.length)];
    const randomDesc =
      mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];

    return {
      city: city,
      country: "Demo",
      temperature: randomTemp,
      feelsLike: randomTemp + Math.floor(Math.random() * 3) - 1,
      humidity: Math.floor(Math.random() * 40) + 40,
      description: randomDesc,
      icon: "01d",
      windSpeed: Math.floor(Math.random() * 10) + 2,
      visibility: Math.floor(Math.random() * 5) + 8,
      timestamp: new Date().toISOString(),
      note: "Mock data - API key not configured",
    };
  } else {
    const forecasts = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      forecasts.push({
        date: date.toDateString(),
        forecasts: [
          {
            time: "09:00",
            temperature: mockTemperatures[i % mockTemperatures.length],
            description: mockDescriptions[i % mockDescriptions.length],
            icon: "01d",
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 10) + 2,
          },
          {
            time: "15:00",
            temperature: mockTemperatures[(i + 2) % mockTemperatures.length],
            description: mockDescriptions[(i + 1) % mockDescriptions.length],
            icon: "02d",
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 10) + 2,
          },
        ],
      });
    }

    return {
      city: city,
      country: "Demo",
      forecasts: forecasts,
      timestamp: new Date().toISOString(),
      note: "Mock data - API key not configured",
    };
  }
}

module.exports = {
  getWeatherData,
};
