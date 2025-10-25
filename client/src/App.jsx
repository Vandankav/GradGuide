import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import SuggestedTrips from "./pages/SuggestedTrips";
import Home from "./pages/Home";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/itinerary" element={<ItineraryBuilder />} />
            <Route path="/suggested-trips" element={<SuggestedTrips />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
