import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Filter,
  Search,
  Heart,
  Share2,
} from "lucide-react";
import { getSuggestedTrips } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const SuggestedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    tags: [],
    priceRange: "",
    duration: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const tagOptions = [
    "romantic",
    "culture",
    "food",
    "adventure",
    "nature",
    "beaches",
    "mountains",
    "city",
    "art",
    "history",
    "spiritual",
    "entertainment",
  ];

  const priceRanges = [
    { value: "$", label: "Budget", color: "text-green-600" },
    { value: "$$", label: "Medium", color: "text-yellow-600" },
    { value: "$$$", label: "Luxury", color: "text-purple-600" },
    { value: "$$$$", label: "Ultra Luxury", color: "text-red-600" },
  ];

  const durationOptions = [
    { value: "3", label: "3 days" },
    { value: "5", label: "5 days" },
    { value: "7", label: "1 week" },
    { value: "10", label: "10 days" },
    { value: "14", label: "2 weeks" },
  ];

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [trips, filters]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await getSuggestedTrips();
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = [...trips];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          trip.destination
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          trip.highlights.some((highlight) =>
            highlight.toLowerCase().includes(filters.search.toLowerCase())
          )
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((trip) =>
        filters.tags.some((tag) => trip.tags.includes(tag))
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (trip) => trip.priceRange === filters.priceRange
      );
    }

    // Duration filter
    if (filters.duration) {
      const targetDays = parseInt(filters.duration);
      filtered = filtered.filter((trip) => {
        const tripDays = parseInt(trip.duration);
        return Math.abs(tripDays - targetDays) <= 2;
      });
    }

    setFilteredTrips(filtered);
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleTagToggle = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handlePriceRangeChange = (priceRange) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === priceRange ? "" : priceRange,
    }));
  };

  const handleDurationChange = (duration) => {
    setFilters((prev) => ({
      ...prev,
      duration: prev.duration === duration ? "" : duration,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      tags: [],
      priceRange: "",
      duration: "",
    });
  };

  const getPriceColor = (priceRange) => {
    const price = priceRanges.find((p) => p.value === priceRange);
    return price ? price.color : "text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Suggested Trips
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing destinations curated by our AI travel experts
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations, activities..."
                value={filters.search}
                onChange={handleSearchChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {(filters.search ||
              filters.tags.length > 0 ||
              filters.priceRange ||
              filters.duration) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Interests & Themes
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        filters.tags.includes(tag)
                          ? "bg-primary-100 text-primary-700 border-2 border-primary-300"
                          : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Budget
                </label>
                <div className="space-y-2">
                  {priceRanges.map((price) => (
                    <button
                      key={price.value}
                      onClick={() => handlePriceRangeChange(price.value)}
                      className={`w-full p-2 rounded-lg border-2 text-left transition-all ${
                        filters.priceRange === price.value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{price.label}</span>
                        <span className={`text-lg font-bold ${price.color}`}>
                          {price.value}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Duration
                </label>
                <div className="space-y-2">
                  {durationOptions.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => handleDurationChange(duration.value)}
                      className={`w-full p-2 rounded-lg border-2 text-left transition-all ${
                        filters.duration === duration.value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredTrips.length} of {trips.length} trips
        </p>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="card hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium text-white ${getPriceColor(
                      trip.priceRange
                    )} bg-black/50`}
                  >
                    {trip.priceRange}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {trip.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{trip.destination}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {trip.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Key Highlights
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {trip.highlights.slice(0, 3).map((highlight, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                    {trip.highlights.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{trip.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{trip.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      <span>{trip.bestTime}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {trip.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button className="flex-1 btn-primary text-sm">
                    View Details
                  </button>
                  <button className="btn-secondary text-sm px-4">
                    Plan Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No trips found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more trips.
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestedTrips;
