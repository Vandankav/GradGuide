const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate itinerary using OpenAI
async function generateItinerary(params, onChunk = null) {
  const {
    destination,
    startDate,
    endDate,
    interests,
    budget,
    groupSize,
    travelStyle,
  } = params;

  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `Create a detailed ${days}-day travel itinerary for ${destination} starting on ${startDate} and ending on ${endDate}.

Traveler Profile:
- Interests: ${interests.join(", ")}
- Budget: ${budget}
- Group Size: ${groupSize}
- Travel Style: ${travelStyle}

Please provide a comprehensive itinerary that includes:
1. Day-by-day breakdown with specific activities
2. Recommended restaurants for each day
3. Transportation options
4. Estimated costs for each activity
5. Best times to visit each attraction
6. Local tips and cultural insights
7. Alternative activities in case of weather issues

Format the response as a structured JSON object with the following structure:
{
  "destination": "${destination}",
  "duration": "${days} days",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "summary": "Brief overview of the trip",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Day theme",
      "activities": [
        {
          "time": "09:00",
          "activity": "Activity name",
          "description": "Detailed description",
          "duration": "2 hours",
          "cost": "$50",
          "location": "Specific location",
          "tips": "Local tips"
        }
      ],
      "meals": [
        {
          "type": "Lunch",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "cost": "$30",
          "description": "Why this restaurant"
        }
      ],
      "transportation": "Transportation details",
      "totalCost": "$150"
    }
  ],
  "totalBudget": "$800",
  "packingTips": ["Essential items to pack"],
  "culturalNotes": ["Important cultural information"],
  "emergencyContacts": ["Local emergency numbers"]
}

Make sure the itinerary is realistic, culturally appropriate, and optimized for the traveler's interests and budget.`;

  try {
    if (onChunk) {
      // Streaming response
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          onChunk(content);
        }
      }

      // Parse the JSON response
      try {
        const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }

      // Fallback: return a structured response even if JSON parsing fails
      return {
        destination,
        duration: `${days} days`,
        startDate,
        endDate,
        summary: "AI-generated itinerary",
        rawResponse: fullResponse,
        days: generateFallbackDays(days, destination),
      };
    } else {
      // Non-streaming response
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;

      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }

      // Fallback response
      return {
        destination,
        duration: `${days} days`,
        startDate,
        endDate,
        summary: "AI-generated itinerary",
        rawResponse: response,
        days: generateFallbackDays(days, destination),
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);

    // Return a fallback itinerary if AI service fails
    return {
      destination,
      duration: `${days} days`,
      startDate,
      endDate,
      summary: `A ${days}-day adventure in ${destination}`,
      days: generateFallbackDays(days, destination),
      note: "This is a sample itinerary. AI service is currently unavailable.",
    };
  }
}

// Generate fallback days when AI service is unavailable
function generateFallbackDays(days, destination) {
  const fallbackDays = [];

  for (let i = 1; i <= days; i++) {
    fallbackDays.push({
      day: i,
      date: new Date(Date.now() + (i - 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      theme:
        i === 1
          ? "Arrival & City Introduction"
          : i === days
          ? "Departure & Last Memories"
          : `Day ${i} Exploration`,
      activities: [
        {
          time: "09:00",
          activity:
            i === 1
              ? "Check-in and orientation"
              : i === days
              ? "Final preparations"
              : "Morning exploration",
          description:
            i === 1
              ? "Get settled and explore the immediate area"
              : i === days
              ? "Prepare for departure"
              : "Discover local attractions and culture",
          duration: "2-3 hours",
          cost: "$20-50",
          location: "City center",
          tips: "Wear comfortable walking shoes",
        },
        {
          time: "14:00",
          activity: "Cultural experience",
          description: "Visit local museums, markets, or landmarks",
          duration: "2-3 hours",
          cost: "$15-30",
          location: "Various locations",
          tips: "Check opening hours in advance",
        },
      ],
      meals: [
        {
          type: "Lunch",
          restaurant: "Local restaurant",
          cuisine: "Local cuisine",
          cost: "$15-25",
          description: "Try authentic local dishes",
        },
      ],
      transportation: "Public transport or walking",
      totalCost: "$50-100",
    });
  }

  return fallbackDays;
}

module.exports = {
  generateItinerary,
};
