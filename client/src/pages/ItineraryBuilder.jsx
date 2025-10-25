import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Heart,
  Clock,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { generateItinerary } from "../services/api";
import WeatherWidget from "../components/WeatherWidget";
import LoadingSpinner from "../components/LoadingSpinner";

const ItineraryBuilder = () => {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    interests: [],
    budget: "medium",
    groupSize: 2,
    travelStyle: "balanced",
  });

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  const interestOptions = [
    "Culture & History",
    "Food & Dining",
    "Nature & Outdoors",
    "Art & Museums",
    "Nightlife",
    "Shopping",
    "Adventure Sports",
    "Relaxation",
    "Photography",
    "Architecture",
    "Music & Entertainment",
    "Local Experiences",
  ];

  const budgetOptions = [
    { value: "budget", label: "Budget", icon: "💰" },
    { value: "medium", label: "Medium", icon: "💳" },
    { value: "luxury", label: "Luxury", icon: "✨" },
  ];

  const travelStyleOptions = [
    {
      value: "relaxed",
      label: "Relaxed",
      description: "Take it easy, enjoy leisurely activities",
    },
    {
      value: "balanced",
      label: "Balanced",
      description: "Mix of activities and relaxation",
    },
    {
      value: "adventurous",
      label: "Adventurous",
      description: "Active and exciting experiences",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setLoading(true);
    setItinerary(null);

    try {
      const result = await generateItinerary(formData);
      setItinerary(result.data);
      toast.success("Itinerary generated successfully!");
    } catch (error) {
      toast.error("Failed to generate itinerary. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingSubmit = async (e) => {
    e.preventDefault();

    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setStreaming(true);
    setStreamingContent("");
    setItinerary(null);

    try {
      const eventSource = new EventSource(`/api/itinerary/generate-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "start") {
          setStreamingContent("Starting itinerary generation...\n");
        } else if (data.type === "chunk") {
          setStreamingContent((prev) => prev + data.content);
        } else if (data.type === "complete") {
          setItinerary(data.data);
          setStreamingContent("");
          toast.success("Itinerary generated successfully!");
          eventSource.close();
        } else if (data.type === "error") {
          toast.error(data.message);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        toast.error("Connection error. Please try again.");
        eventSource.close();
        setStreaming(false);
      };
    } catch (error) {
      toast.error("Failed to start streaming. Please try again.");
      console.error("Error:", error);
      setStreaming(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Itinerary Builder
        </h1>
        <p className="text-xl text-gray-600">
          Tell us about your dream trip and we'll create a personalized
          itinerary just for you
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Trip Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="e.g., Paris, Tokyo, New York"
                  className="input-field"
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input-field"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input-field"
                    min={
                      formData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Group Size
                </label>
                <select
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value={1}>Solo Traveler</option>
                  <option value={2}>Couple</option>
                  <option value={3}>Small Group (3-4)</option>
                  <option value={5}>Medium Group (5-8)</option>
                  <option value={10}>Large Group (9+)</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Budget
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {budgetOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          budget: option.value,
                        }))
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.budget === option.value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="inline h-4 w-4 mr-1" />
                  Travel Style
                </label>
                <div className="space-y-2">
                  {travelStyleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          travelStyle: option.value,
                        }))
                      }
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        formData.travelStyle === option.value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        formData.interests.includes(interest)
                          ? "bg-primary-100 text-primary-700 border-2 border-primary-300"
                          : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Itinerary</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStreamingSubmit}
                  disabled={streaming}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  {streaming ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Clock className="h-5 w-5" />
                      <span>Watch AI Generate (Streaming)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {/* Weather Widget */}
          {formData.destination && (
            <div className="mb-8">
              <WeatherWidget destination={formData.destination} />
            </div>
          )}

          {/* Streaming Content */}
          {streaming && streamingContent && (
            <div className="card mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI is thinking...
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {streamingContent}
              </div>
            </div>
          )}

          {/* Itinerary Results */}
          {itinerary && (
            <div className="space-y-6">
              {/* Itinerary Header */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {itinerary.destination}
                    </h2>
                    <p className="text-gray-600">
                      {itinerary.duration} • {itinerary.startDate} to
                      {itinerary.endDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary flex items-center space-x-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                    <button className="btn-primary flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {itinerary.summary && (
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                    {itinerary.summary}
                  </p>
                )}
              </div>

              {/* Daily Itinerary */}
              {itinerary.days &&
                itinerary.days.map((day, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Day {day.day}
                        </h3>
                        <p className="text-gray-600">{formatDate(day.date)}</p>
                        {day.theme && (
                          <p className="text-sm text-primary-600 font-medium">
                            {day.theme}
                          </p>
                        )}
                      </div>
                      {day.totalCost && (
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Daily Cost
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {day.totalCost}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Activities */}
                    <div className="space-y-4">
                      {day.activities &&
                        day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="border-l-4 border-primary-200 pl-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-600">
                                    {activity.time}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    • {activity.duration}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {activity.activity}
                                </h4>
                                <p className="text-gray-700 mb-2">
                                  {activity.description}
                                </p>
                                {activity.location && (
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {activity.location}
                                  </p>
                                )}
                                {activity.tips && (
                                  <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded mt-2">
                                    💡 {activity.tips}
                                  </p>
                                )}
                              </div>
                              {activity.cost && (
                                <div className="text-right ml-4">
                                  <div className="text-sm font-medium text-green-600">
                                    {activity.cost}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Meals */}
                    {day.meals && day.meals.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Dining
                        </h4>
                        <div className="space-y-3">
                          {day.meals.map((meal, mealIndex) => (
                            <div
                              key={mealIndex}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {meal.restaurant}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {meal.cuisine} • {meal.type}
                                  </div>
                                  {meal.description && (
                                    <div className="text-sm text-gray-700 mt-1">
                                      {meal.description}
                                    </div>
                                  )}
                                </div>
                                {meal.cost && (
                                  <div className="text-sm font-medium text-green-600">
                                    {meal.cost}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transportation */}
                    {day.transportation && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <strong>Transportation:</strong> {day.transportation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              {/* Additional Information */}
              {(itinerary.packingTips || itinerary.culturalNotes) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {itinerary.packingTips && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Packing Tips
                      </h3>
                      <ul className="space-y-2">
                        {itinerary.packingTips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-primary-600 mt-1">•</span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {itinerary.culturalNotes && (
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Cultural Notes
                      </h3>
                      <ul className="space-y-2">
                        {itinerary.culturalNotes.map((note, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-primary-600 mt-1">•</span>
                            <span className="text-gray-700">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Total Budget */}
              {itinerary.totalBudget && (
                <div className="card bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        Estimated Total Budget
                      </h3>
                      <p className="text-green-700">For the entire trip</p>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {itinerary.totalBudget}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!itinerary && !loading && !streaming && (
            <div className="card text-center py-12">
              <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Plan Your Trip?
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out the form on the left and let our AI create a
                personalized itinerary for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
