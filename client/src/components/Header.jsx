import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, Compass, Home, Sparkles } from "lucide-react";

const Header = ({ activeTab, setActiveTab }) => {
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", path: "/", icon: Home },
    {
      id: "itinerary",
      label: "Itinerary Builder",
      path: "/itinerary",
      icon: MapPin,
    },
    {
      id: "suggested-trips",
      label: "Suggested Trips",
      path: "/suggested-trips",
      icon: Compass,
    },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-gradient"
            onClick={() => setActiveTab("home")}
          >
            <Sparkles className="h-8 w-8 text-primary-600" />
            <span>AI Travel Guide</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-100 text-primary-700 font-medium"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-100 text-primary-700 font-medium"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
