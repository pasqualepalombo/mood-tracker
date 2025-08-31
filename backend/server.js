const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'moods.json');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your-api-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Helper function to read mood data
async function readMoods() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { entries: [] };
  }
}

// Helper function to write mood data
async function writeMoods(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Helper function to fetch weather data
async function getWeatherData(lat = 40.7128, lon = -74.0060) { // Default to NYC
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    return {
      condition: response.data.weather[0].main.toLowerCase(),
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      city: response.data.name
    };
  } catch (error) {
    // Return mock weather data if API fails
    return {
      condition: 'unknown',
      temperature: 20,
      description: 'Weather data unavailable',
      humidity: 50,
      city: 'Unknown'
    };
  }
}

// API Routes

// POST /api/mood - Log a new mood entry
app.post('/api/mood', async (req, res) => {
  try {
    const { mood, notes, lat, lon } = req.body;
    
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Get weather data
    const weather = await getWeatherData(lat, lon);
    
    // Create new entry
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mood: mood.toLowerCase(),
      notes: notes || '',
      weather
    };

    // Read existing data and add new entry
    const data = await readMoods();
    data.entries.push(entry);
    
    // Write back to file
    await writeMoods(data);
    
    res.status(201).json({ success: true, entry });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

// GET /api/moods - Retrieve all mood entries
app.get('/api/moods', async (req, res) => {
  try {
    const data = await readMoods();
    // Sort by timestamp (newest first)
    const sortedEntries = data.entries.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    res.json({ entries: sortedEntries });
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// GET /api/insights - Get mood-weather correlations
app.get('/api/insights', async (req, res) => {
  try {
    const data = await readMoods();
    const entries = data.entries;
    
    if (entries.length === 0) {
      return res.json({ 
        totalEntries: 0,
        insights: ['Start logging your moods to see insights!']
      });
    }

    // Calculate basic insights
    const moodCounts = {};
    const weatherMoodMap = {};
    
    entries.forEach(entry => {
      // Count moods
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      
      // Map weather to moods
      const weather = entry.weather.condition;
      if (!weatherMoodMap[weather]) {
        weatherMoodMap[weather] = [];
      }
      weatherMoodMap[weather].push(entry.mood);
    });

    // Generate insights
    const insights = [];
    const totalEntries = entries.length;
    
    // Most common mood
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    insights.push(`Your most common mood is "${mostCommonMood}" (${moodCounts[mostCommonMood]} times)`);
    
    // Weather correlations
    Object.keys(weatherMoodMap).forEach(weather => {
      const moods = weatherMoodMap[weather];
      const positiveMoods = moods.filter(mood => 
        ['happy', 'energetic', 'calm'].includes(mood)
      ).length;
      const percentage = Math.round((positiveMoods / moods.length) * 100);
      
      if (moods.length >= 2) {
        insights.push(`On ${weather} days, you feel positive ${percentage}% of the time`);
      }
    });

    // Recent mood trend
    if (entries.length >= 3) {
      const recentEntries = entries.slice(0, 3);
      const recentMoods = recentEntries.map(e => e.mood);
      const uniqueRecentMoods = [...new Set(recentMoods)];
      
      if (uniqueRecentMoods.length === 1) {
        insights.push(`You've been consistently ${uniqueRecentMoods[0]} lately`);
      } else {
        insights.push(`Your mood has been varied recently: ${uniqueRecentMoods.join(', ')}`);
      }
    }

    res.json({
      totalEntries,
      moodCounts,
      insights: insights.slice(0, 5) // Limit to 5 insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🌈 Mood Tracker server running on http://localhost:${PORT}`);
  console.log(`📊 Ready to track your moods and weather patterns!`);
  
  if (WEATHER_API_KEY === 'your-api-key-here') {
    console.log('⚠️  Note: Set WEATHER_API_KEY environment variable for weather data');
  }
});
