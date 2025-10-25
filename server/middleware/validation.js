// Validation middleware for itinerary requests
function validateItineraryRequest(req, res, next) {
  const { destination, startDate, endDate, interests } = req.body;

  // Check required fields
  if (!destination || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
      message: "Destination, start date, and end date are required",
    });
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      error: "Invalid date format",
      message: "Please provide valid dates in YYYY-MM-DD format",
    });
  }

  if (start < today) {
    return res.status(400).json({
      success: false,
      error: "Invalid start date",
      message: "Start date cannot be in the past",
    });
  }

  if (end <= start) {
    return res.status(400).json({
      success: false,
      error: "Invalid date range",
      message: "End date must be after start date",
    });
  }

  // Check if trip is too long (more than 30 days)
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (daysDiff > 30) {
    return res.status(400).json({
      success: false,
      error: "Trip too long",
      message: "Maximum trip duration is 30 days",
    });
  }

  // Validate interests array
  if (interests && !Array.isArray(interests)) {
    return res.status(400).json({
      success: false,
      error: "Invalid interests format",
      message: "Interests must be an array",
    });
  }

  // Set default values for optional fields
  req.body.interests = interests || ["culture", "food", "sightseeing"];
  req.body.budget = req.body.budget || "medium";
  req.body.groupSize = req.body.groupSize || 2;
  req.body.travelStyle = req.body.travelStyle || "balanced";

  next();
}

module.exports = {
  validateItineraryRequest,
};
