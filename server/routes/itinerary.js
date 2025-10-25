const express = require("express");
const router = express.Router();
const { generateItinerary } = require("../services/aiService");
const { validateItineraryRequest } = require("../middleware/validation");

// Generate personalized itinerary
router.post("/generate", validateItineraryRequest, async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      interests,
      budget,
      groupSize,
      travelStyle,
    } = req.body;

    console.log("Generating itinerary for:", {
      destination,
      startDate,
      endDate,
      interests,
    });

    const itinerary = await generateItinerary({
      destination,
      startDate,
      endDate,
      interests,
      budget,
      groupSize,
      travelStyle,
    });

    res.json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate itinerary",
      message: error.message,
    });
  }
});

// Stream itinerary generation (for real-time updates)
router.post("/generate-stream", validateItineraryRequest, (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      interests,
      budget,
      groupSize,
      travelStyle,
    } = req.body;

    // Set up Server-Sent Events
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });

    // Send initial message
    res.write(
      `data: ${JSON.stringify({
        type: "start",
        message: "Starting itinerary generation...",
      })}\n\n`
    );

    // Generate itinerary with streaming
    generateItinerary(
      {
        destination,
        startDate,
        endDate,
        interests,
        budget,
        groupSize,
        travelStyle,
      },
      (chunk) => {
        res.write(
          `data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`
        );
      }
    )
      .then((itinerary) => {
        res.write(
          `data: ${JSON.stringify({ type: "complete", data: itinerary })}\n\n`
        );
        res.end();
      })
      .catch((error) => {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: error.message,
          })}\n\n`
        );
        res.end();
      });
  } catch (error) {
    console.error("Error in streaming itinerary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate itinerary",
      message: error.message,
    });
  }
});

module.exports = router;
