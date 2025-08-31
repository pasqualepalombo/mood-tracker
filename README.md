NB: Il README è stato creato con l'ausilio di un AI Agent.

# 🌈 Personal Mood Tracker

A simple web application to track your daily moods and discover correlations with weather patterns.

## ✨ Features

- **Mood Logging**: Track 6 different mood types with optional notes
- **Weather Integration**: Automatic weather data collection with each mood entry
- **Smart Insights**: Discover patterns between your moods and weather conditions
- **Timeline View**: See your recent mood history with timestamps and weather
- **Responsive Design**: Works great on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone or download this project**
2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Set your OpenWeatherMap API key
   $env:WEATHER_API_KEY="your-actual-api-key-here"  # PowerShell
   # OR
   export WEATHER_API_KEY="your-actual-api-key-here"  # Bash/Git Bash
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 How to Use

1. **Select your current mood** from the six emoji options
2. **Add optional notes** about what's influencing your mood
3. **Click "Log mood"** - weather data is automatically captured
4. **View insights** to see patterns between your moods and weather
5. **Check your timeline** to see recent mood entries

## 🏗️ Project Structure

```
mood-tracker/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── data/
│   │   └── moods.json     # JSON file storage for mood entries
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── index.html         # Main HTML interface
│   ├── styles.css         # CSS styling and responsive design
│   └── script.js          # Frontend JavaScript and API calls
└── README.md
```

## 🌐 API Endpoints

- `POST /api/mood` - Log a new mood entry with weather data
- `GET /api/moods` - Retrieve all mood entries (sorted by date)
- `GET /api/insights` - Get mood-weather correlations and statistics

## 🚀 Deployment Options

### Quick Deploy (Recommended)

**Backend (Railway/Render/Heroku):**
1. Connect your GitHub repo
2. Set `WEATHER_API_KEY` environment variable
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`

**Frontend (Netlify/Vercel):**
1. Deploy the `frontend/` folder as a static site
2. Set up proxy to redirect `/api/*` to your backend URL

### Environment Variables
- `WEATHER_API_KEY`: Your OpenWeatherMap API key
- `PORT`: Server port (default: 3000)

## 🎨 Customization Ideas

- Add more mood types or custom mood categories
- Integrate with additional weather APIs for more detailed data
- Add data export functionality (CSV/JSON)
- Implement user authentication for multiple users
- Add data visualization charts
- Create mood prediction based on weather forecasts

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Storage**: JSON file (easily upgradeable to database)
- **Weather API**: OpenWeatherMap
- **Styling**: Custom CSS with gradient backgrounds and animations

## 📝 Sample Data

The app automatically creates entries like this:
```json
{
  "id": "1693478400000",
  "timestamp": "2024-08-31T08:00:00.000Z",
  "mood": "happy",
  "notes": "Great morning coffee!",
  "weather": {
    "condition": "clear",
    "temperature": 22,
    "description": "clear sky",
    "humidity": 45,
    "city": "New York"
  }
}
```

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Integration with fitness trackers
- Mood prediction algorithms
- Social features (share mood insights)
- Advanced data visualization

---

**Built with ❤️ and coffee** ☕
