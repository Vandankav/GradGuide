import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Compass, Sparkles, Globe, Clock, Users } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: "AI Itinerary Builder",
      description:
        "Get personalized travel plans based on your preferences, interests, and budget.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Compass,
      title: "Suggested Trips",
      description:
        "Discover amazing destinations with pre-curated travel suggestions and highlights.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Globe,
      title: "Weather Integration",
      description:
        "Check current weather and forecasts for your chosen destinations.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Sparkles,
      title: "Real-time AI",
      description:
        "Experience dynamic itinerary generation with streaming AI responses.",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const stats = [
    { icon: Globe, label: "Destinations", value: "50+" },
    { icon: Users, label: "Happy Travelers", value: "1000+" },
    { icon: Clock, label: "Avg. Planning Time", value: "2 min" },
    { icon: Sparkles, label: "AI Accuracy", value: "95%" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal
            <span className="text-gradient block">AI Travel Guide</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing destinations and create personalized itineraries
            with the power of AI. Plan your perfect trip in minutes, not hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/itinerary"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
            >
              <MapPin className="h-5 w-5" />
              <span>Build My Itinerary</span>
            </Link>
            <Link
              to="/suggested-trips"
              className="btn-secondary text-lg px-8 py-3 inline-flex items-center space-x-2"
            >
              <Compass className="h-5 w-5" />
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 rounded-2xl mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our AI Travel Guide?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of travel planning with intelligent
            recommendations and personalized itineraries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} ${feature.color} rounded-lg mb-4`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who have discovered their perfect
            destinations with AI assistance.
          </p>
          <Link
            to="/itinerary"
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Start Planning Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
