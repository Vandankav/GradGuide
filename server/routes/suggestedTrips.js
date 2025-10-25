const express = require("express");
const router = express.Router();

// Pre-curated suggested trips data
const suggestedTrips = [
  {
    id: 1,
    title: "Romantic Paris Getaway",
    destination: "Paris, France",
    duration: "4 days",
    bestTime: "April - October",
    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "Seine River Cruise",
      "Montmartre",
    ],
    description:
      "Experience the city of love with iconic landmarks, world-class museums, and charming cafes.",
    image:
      "https://images.unsplash.com/photo-1699726252091-8b1f0d621d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332",
    priceRange: "$$$",
    tags: ["romantic", "culture", "art", "food"],
  },
  {
    id: 2,
    title: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    duration: "7 days",
    bestTime: "March - May, September - November",
    highlights: [
      "Senso-ji Temple",
      "Shibuya Crossing",
      "Tsukiji Fish Market",
      "Tokyo Skytree",
    ],
    description:
      "Discover the perfect blend of traditional culture and modern innovation in Japan's capital.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    priceRange: "$$",
    tags: ["culture", "food", "technology", "temples"],
  },
  {
    id: 3,
    title: "Santorini Sunset Experience",
    destination: "Santorini, Greece",
    duration: "5 days",
    bestTime: "May - September",
    highlights: ["Oia Sunset", "Red Beach", "Wine Tasting", "Ancient Thera"],
    description:
      "Witness breathtaking sunsets and explore volcanic landscapes in this Greek paradise.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    priceRange: "$$$",
    tags: ["romantic", "beaches", "sunset", "wine"],
  },
  {
    id: 4,
    title: "New York City Explorer",
    destination: "New York, USA",
    duration: "6 days",
    bestTime: "April - June, September - November",
    highlights: [
      "Central Park",
      "Broadway Show",
      "Statue of Liberty",
      "Brooklyn Bridge",
    ],
    description:
      "Experience the energy of the Big Apple with iconic landmarks and world-class entertainment.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    priceRange: "$$$",
    tags: ["city", "entertainment", "shopping", "culture"],
  },
  {
    id: 5,
    title: "Bali Tropical Retreat",
    destination: "Bali, Indonesia",
    duration: "8 days",
    bestTime: "April - October",
    highlights: [
      "Ubud Rice Terraces",
      "Temple of Besakih",
      "Beach Hopping",
      "Traditional Markets",
    ],
    description:
      "Immerse yourself in Balinese culture while enjoying pristine beaches and lush landscapes.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
    priceRange: "$",
    tags: ["beaches", "culture", "nature", "spiritual"],
  },
  {
    id: 6,
    title: "Swiss Alpine Adventure",
    destination: "Switzerland",
    duration: "6 days",
    bestTime: "June - September",
    highlights: ["Matterhorn", "Jungfraujoch", "Lake Geneva", "Swiss Alps"],
    description:
      "Explore pristine alpine landscapes, charming villages, and world-class mountain scenery.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    priceRange: "$$$$",
    tags: ["mountains", "nature", "adventure", "scenic"],
  },
];

// Get all suggested trips
router.get("/", (req, res) => {
  try {
    const { tags, priceRange, duration } = req.query;

    let filteredTrips = [...suggestedTrips];

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",");
      filteredTrips = filteredTrips.filter((trip) =>
        tagArray.some((tag) => trip.tags.includes(tag))
      );
    }

    // Filter by price range
    if (priceRange) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.priceRange === priceRange
      );
    }

    // Filter by duration (approximate)
    if (duration) {
      const days = parseInt(duration);
      filteredTrips = filteredTrips.filter((trip) => {
        const tripDays = parseInt(trip.duration);
        return Math.abs(tripDays - days) <= 2; // Allow 2-day variance
      });
    }

    res.json({
      success: true,
      data: filteredTrips,
    });
  } catch (error) {
    console.error("Error fetching suggested trips:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch suggested trips",
      message: error.message,
    });
  }
});

// Get a specific suggested trip
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const trip = suggestedTrips.find((t) => t.id === parseInt(id));

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: "Trip not found",
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch trip",
      message: error.message,
    });
  }
});

module.exports = router;
