// import React, { useState, useEffect } from "react";
// import {
//   Cloud,
//   Sun,
//   CloudRain,
//   Snowflake,
//   Wind,
//   Eye,
//   Droplets,
// } from "lucide-react";
// import { getWeatherData } from "../services/api";
// import LoadingSpinner from "./LoadingSpinner";

// const WeatherWidget = ({ destination }) => {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (destination) {
//       fetchWeather();
//     }
//   }, [destination]);

//   const fetchWeather = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getWeatherData(destination);
//       setWeather(response.data);
//     } catch (err) {
//       setError("Failed to fetch weather data");
//       console.error("Weather fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getWeatherIcon = (iconCode) => {
//     if (iconCode.includes("01"))
//       return <Sun className="h-8 w-8 text-yellow-500" />;
//     if (iconCode.includes("02") || iconCode.includes("03"))
//       return <Cloud className="h-8 w-8 text-gray-500" />;
//     if (iconCode.includes("09") || iconCode.includes("10"))
//       return <CloudRain className="h-8 w-8 text-blue-500" />;
//     if (iconCode.includes("13"))
//       return <Snowflake className="h-8 w-8 text-blue-300" />;
//     return <Cloud className="h-8 w-8 text-gray-500" />;
//   };

//   const getWeatherDescription = (description) => {
//     return description
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   if (loading) {
//     return (
//       <div className="card">
//         <div className="flex items-center justify-center py-8">
//           <LoadingSpinner size="md" />
//           <span className="ml-3 text-gray-600">Loading weather...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card bg-red-50 border-red-200">
//         <div className="text-center py-4">
//           <Cloud className="h-8 w-8 text-red-400 mx-auto mb-2" />
//           <p className="text-red-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!weather) {
//     return null;
//   }

//   return (
//     <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-lg font-semibold">Current Weather</h3>
//           <p className="text-blue-100">
//             {weather.city}, {weather.country}
//           </p>
//         </div>
//         {getWeatherIcon(weather.icon)}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="text-center">
//           <div className="text-3xl font-bold">{weather.temperature}°C</div>
//           <div className="text-sm text-blue-100">
//             Feels like {weather.feelsLike}°C
//           </div>
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-blue-100">Description</span>
//             <span className="font-medium">
//               {getWeatherDescription(weather.description)}
//             </span>
//           </div>

//           <div className="flex items-center justify-between text-sm">
//             <span className="text-blue-100 flex items-center">
//               <Droplets className="h-3 w-3 mr-1" />
//               Humidity
//             </span>
//             <span className="font-medium">{weather.humidity}%</span>
//           </div>

//           <div className="flex items-center justify-between text-sm">
//             <span className="text-blue-100 flex items-center">
//               <Wind className="h-3 w-3 mr-1" />
//               Wind
//             </span>
//             <span className="font-medium">{weather.windSpeed} m/s</span>
//           </div>

//           {weather.visibility && (
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-blue-100 flex items-center">
//                 <Eye className="h-3 w-3 mr-1" />
//                 Visibility
//               </span>
//               <span className="font-medium">{weather.visibility} km</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {weather.note && (
//         <div className="mt-4 pt-4 border-t border-blue-400/30">
//           <p className="text-xs text-blue-200 text-center">{weather.note}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WeatherWidget;

import React, { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Eye,
  Droplets,
} from "lucide-react";
import { getWeatherData } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

const WeatherWidget = ({ destination }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedDestination, setDebouncedDestination] = useState(destination);

  // Debounce destination changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDestination(destination);
    }, 600); // wait 600ms after user stops typing

    return () => clearTimeout(handler); // clear timeout if destination changes again
  }, [destination]);

  // Fetch weather when debounced destination changes
  useEffect(() => {
    if (!debouncedDestination || debouncedDestination.trim().length < 3) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🌤 Fetching weather for:", debouncedDestination);

        const response = await getWeatherData(debouncedDestination.trim());
        setWeather(response.data);
      } catch (err) {
        setError("Failed to fetch weather data");

        if (err.response && err.response.status === 404) {
          console.warn(`⚠️ City not found: ${debouncedDestination}`);
        } else {
          console.error(
            `❌ Weather fetch error for ${debouncedDestination}:`,
            err.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [debouncedDestination]);

  const getWeatherIcon = (iconCode) => {
    if (iconCode.includes("01"))
      return <Sun className="h-8 w-8 text-yellow-500" />;
    if (iconCode.includes("02") || iconCode.includes("03"))
      return <Cloud className="h-8 w-8 text-gray-500" />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (iconCode.includes("13"))
      return <Snowflake className="h-8 w-8 text-blue-300" />;
    return <Cloud className="h-8 w-8 text-gray-500" />;
  };

  const getWeatherDescription = (description) => {
    return description
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <span className="ml-3 text-gray-600">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <div className="text-center py-4">
          <Cloud className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Current Weather</h3>
          <p className="text-blue-100">
            {weather.city}, {weather.country}
          </p>
        </div>
        {getWeatherIcon(weather.icon)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{weather.temperature}°C</div>
          <div className="text-sm text-blue-100">
            Feels like {weather.feelsLike}°C
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-100">Description</span>
            <span className="font-medium">
              {getWeatherDescription(weather.description)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-100 flex items-center">
              <Droplets className="h-3 w-3 mr-1" />
              Humidity
            </span>
            <span className="font-medium">{weather.humidity}%</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-100 flex items-center">
              <Wind className="h-3 w-3 mr-1" />
              Wind
            </span>
            <span className="font-medium">{weather.windSpeed} m/s</span>
          </div>

          {weather.visibility && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-100 flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                Visibility
              </span>
              <span className="font-medium">{weather.visibility} km</span>
            </div>
          )}
        </div>
      </div>

      {weather.note && (
        <div className="mt-4 pt-4 border-t border-blue-400/30">
          <p className="text-xs text-blue-200 text-center">{weather.note}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
