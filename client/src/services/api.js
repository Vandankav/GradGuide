import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const generateItinerary = async (formData) => {
  try {
    const response = await api.post("/itinerary/generate", formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to generate itinerary"
    );
  }
};

export const getWeatherData = async (city, days = 1) => {
  try {
    const endpoint =
      days === 1
        ? `/weather/current/${city}`
        : `/weather/forecast/${city}?days=${days}`;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch weather data"
    );
  }
};

export const getSuggestedTrips = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.tags && filters.tags.length > 0) {
      params.append("tags", filters.tags.join(","));
    }
    if (filters.priceRange) {
      params.append("priceRange", filters.priceRange);
    }
    if (filters.duration) {
      params.append("duration", filters.duration);
    }

    const response = await api.get(`/suggested-trips?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch suggested trips"
    );
  }
};

export const getSuggestedTrip = async (id) => {
  try {
    const response = await api.get(`/suggested-trips/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch trip details"
    );
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    throw new Error("API is not available");
  }
};

export default api;
