# AI Travel Guide - Personalized Tour Planner

A comprehensive web application that functions as an AI-powered personal travel guide, helping users generate personalized travel itineraries and discover amazing destinations.

## 🌟 Features

### 🗺️ AI Itinerary Builder

- **Personalized Planning**: Generate custom travel itineraries based on your preferences, interests, and budget
- **Real-time AI Generation**: Watch AI create your itinerary in real-time with streaming responses
- **Smart Recommendations**: Get day-by-day activities, restaurant suggestions, and transportation options
- **Budget Optimization**: Receive cost estimates and budget-friendly alternatives

### 🎯 Suggested Trips

- **Curated Destinations**: Explore pre-selected amazing destinations worldwide
- **Smart Filtering**: Filter by interests, budget, duration, and travel style
- **Rich Details**: Get comprehensive information about each destination including highlights and best times to visit

### 🌤️ Weather Integration

- **Current Weather**: Real-time weather information for your chosen destinations
- **Weather Forecasts**: Multi-day weather predictions to help plan your activities
- **Visual Weather Widget**: Beautiful weather display with icons and detailed information

### 🚀 Advanced Features

- **Streaming AI Responses**: Experience dynamic itinerary generation with real-time updates
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Interactive Components**: Smooth animations and intuitive user experience
- **Export Functionality**: Save and share your itineraries

## 🛠️ Tech Stack

### Frontend

- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for beautiful icons

### Backend

- **Node.js** with Express.js framework
- **MongoDB** for data persistence (optional)
- **OpenAI API** for AI-powered itinerary generation
- **OpenWeatherMap API** for weather data
- **Server-Sent Events** for real-time streaming

### Development Tools

- **Vite** for fast frontend development
- **Nodemon** for backend auto-restart
- **Concurrently** for running both frontend and backend
- **ESLint** for code quality

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional, for data persistence)
- OpenAI API key (for AI features)
- OpenWeatherMap API key (for weather data)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-travel-guide
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:

   ```bash
   cd server
   cp env.example .env
   ```

   Update the `.env` file with your API keys:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   # Database (Optional)
   MONGODB_URI=mongodb://localhost:27017/ai-travel-guide

   # AI API Keys (Choose one)
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here

   # Weather API
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

4. **Get API Keys**

   **OpenAI API Key:**

   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account and generate an API key
   - Add the key to your `.env` file

   **OpenWeatherMap API Key:**

   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key
   - Add the key to your `.env` file

5. **Start the application**

   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 5173).

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 Usage

### Building an Itinerary

1. Navigate to the "Itinerary Builder" tab
2. Fill in your trip details:
   - Destination
   - Travel dates
   - Group size
   - Budget preference
   - Travel style
   - Interests and activities
3. Click "Generate Itinerary" for standard generation or "Watch AI Generate" for streaming
4. Review your personalized itinerary with day-by-day activities, restaurants, and costs

### Exploring Suggested Trips

1. Go to the "Suggested Trips" tab
2. Browse curated destinations or use filters to find specific types of trips
3. Filter by:
   - Interests and themes
   - Budget range
   - Trip duration
   - Search keywords
4. Click on any trip to view detailed information

### Weather Information

- Weather data is automatically displayed for your chosen destinations
- View current conditions and forecasts
- Plan activities based on weather predictions

## 🔧 Development

### Project Structure

```
ai-travel-guide/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   └── index.js           # Server entry point
├── package.json           # Root package.json
└── README.md
```

### Available Scripts

**Root level:**

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm start` - Start the production server

**Backend (server/):**

- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production mode

**Frontend (client/):**

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### API Endpoints

**Itinerary:**

- `POST /api/itinerary/generate` - Generate itinerary
- `POST /api/itinerary/generate-stream` - Stream itinerary generation

**Weather:**

- `GET /api/weather/current/:city` - Get current weather
- `GET /api/weather/forecast/:city` - Get weather forecast

**Suggested Trips:**

- `GET /api/suggested-trips` - Get all suggested trips
- `GET /api/suggested-trips/:id` - Get specific trip

**Health:**

- `GET /api/health` - API health check

## 🎨 Customization

### Adding New Destinations

Edit `server/routes/suggestedTrips.js` to add new curated destinations to the suggested trips section.

### Customizing AI Prompts

Modify the prompt in `server/services/aiService.js` to change how the AI generates itineraries.

### Styling

The application uses Tailwind CSS. Customize the design by modifying:

- `client/tailwind.config.js` - Tailwind configuration
- `client/src/index.css` - Global styles
- Component-specific styles in individual components

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `client/dist` folder to your hosting service
3. Update the API base URL in production

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Ensure MongoDB connection (if using database)

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
OPENAI_API_KEY=your_production_openai_key
OPENWEATHER_API_KEY=your_production_weather_key
MONGODB_URI=your_production_mongodb_uri
```

## 🐛 Troubleshooting

### Common Issues

**API Key Errors:**

- Ensure your API keys are correctly set in the `.env` file
- Check that the API keys have sufficient credits/permissions

**CORS Issues:**

- Verify the `CLIENT_URL` in your `.env` file matches your frontend URL
- Check the CORS configuration in `server/index.js`

**Weather Data Not Loading:**

- Confirm your OpenWeatherMap API key is valid
- Check the API rate limits

**AI Generation Failing:**

- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Review the API error logs in the browser console

### Debug Mode

Set `NODE_ENV=development` in your `.env` file to enable detailed error messages.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check the browser console for error messages
4. Ensure all environment variables are properly set

## 🎯 Future Enhancements

- [ ] User authentication and saved itineraries
- [ ] Integration with booking platforms
- [ ] Offline mode support
- [ ] Mobile app development
- [ ] Advanced AI features (image recognition, voice input)
- [ ] Social sharing and collaboration features
- [ ] Integration with more travel APIs
- [ ] Multi-language support

---

**Happy Traveling! 🌍✈️**
