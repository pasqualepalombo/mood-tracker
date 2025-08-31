// API Base URL
const API_BASE = window.location.origin;

// DOM Elements
const moodForm = document.getElementById('mood-form');
const moodButtons = document.querySelectorAll('.mood-btn');
const moodNotes = document.getElementById('mood-notes');
const submitButton = document.getElementById('submit-mood');
const submitText = document.getElementById('submit-text');
const submitLoading = document.getElementById('submit-loading');
const insightsContent = document.getElementById('insights-content');
const moodTimeline = document.getElementById('mood-timeline');
const toast = document.getElementById('toast');

// State
let selectedMood = null;
let userLocation = null;

// Mood emoji mapping
const moodEmojis = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    energetic: '⚡',
    calm: '😌',
    stressed: '😰'
};

// Weather emoji mapping
const weatherEmojis = {
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    snow: '❄️',
    thunderstorm: '⛈️',
    drizzle: '🌦️',
    mist: '🌫️',
    fog: '🌫️',
    unknown: '🌤️'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeMoodButtons();
    getUserLocation();
    loadMoodHistory();
    loadInsights();
});

// Initialize mood button selection
function initializeMoodButtons() {
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            button.classList.add('selected');
            selectedMood = button.dataset.mood;
            
            // Enable submit button
            submitButton.disabled = false;
            submitText.textContent = `Log ${selectedMood} mood`;
        });
    });
}

// Get user's location for weather data
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
            },
            (error) => {
                console.log('Location access denied, using default location');
            }
        );
    }
}

// Handle form submission
moodForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedMood) {
        showToast('Please select a mood first', 'error');
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';

    try {
        const payload = {
            mood: selectedMood,
            notes: moodNotes.value.trim(),
            ...userLocation
        };

        const response = await fetch(`${API_BASE}/api/mood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to log mood');
        }

        const result = await response.json();
        
        // Reset form
        resetForm();
        
        // Refresh data
        loadMoodHistory();
        loadInsights();
        
        showToast(`${moodEmojis[selectedMood]} Mood logged successfully!`, 'success');
        
    } catch (error) {
        console.error('Error logging mood:', error);
        showToast('Failed to log mood. Please try again.', 'error');
    } finally {
        // Reset button state
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
        submitButton.disabled = false;
    }
});

// Reset form after submission
function resetForm() {
    selectedMood = null;
    moodNotes.value = '';
    moodButtons.forEach(btn => btn.classList.remove('selected'));
    submitButton.disabled = true;
    submitText.textContent = 'Select a mood first';
}

// Load and display mood history
async function loadMoodHistory() {
    try {
        const response = await fetch(`${API_BASE}/api/moods`);
        if (!response.ok) throw new Error('Failed to fetch moods');
        
        const data = await response.json();
        displayMoodHistory(data.entries);
    } catch (error) {
        console.error('Error loading mood history:', error);
        moodTimeline.innerHTML = '<p class="loading">Failed to load mood history</p>';
    }
}

// Display mood history in timeline format
function displayMoodHistory(entries) {
    if (entries.length === 0) {
        moodTimeline.innerHTML = `
            <div class="empty-state">
                <span class="emoji">📝</span>
                <p>No mood entries yet</p>
                <p>Start by logging your first mood above!</p>
            </div>
        `;
        return;
    }

    const timelineHTML = entries.slice(0, 10).map(entry => {
        const date = new Date(entry.timestamp);
        const timeString = date.toLocaleDateString() + ' at ' + 
                          date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const weatherEmoji = weatherEmojis[entry.weather.condition] || weatherEmojis.unknown;
        
        return `
            <div class="mood-entry ${entry.mood}">
                <div class="mood-icon">${moodEmojis[entry.mood] || '❓'}</div>
                <div class="mood-details">
                    <h4>${entry.mood}</h4>
                    <div class="mood-time">${timeString}</div>
                    <div class="mood-weather">
                        ${weatherEmoji} ${entry.weather.temperature}°C, ${entry.weather.description}
                        ${entry.weather.city !== 'Unknown' ? `in ${entry.weather.city}` : ''}
                    </div>
                    ${entry.notes ? `<div class="mood-notes">"${entry.notes}"</div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    moodTimeline.innerHTML = timelineHTML;
}

// Load and display insights
async function loadInsights() {
    try {
        const response = await fetch(`${API_BASE}/api/insights`);
        if (!response.ok) throw new Error('Failed to fetch insights');
        
        const data = await response.json();
        displayInsights(data);
    } catch (error) {
        console.error('Error loading insights:', error);
        insightsContent.innerHTML = '<p class="loading">Failed to load insights</p>';
    }
}

// Display insights
function displayInsights(data) {
    if (data.insights.length === 0 || data.totalEntries === 0) {
        insightsContent.innerHTML = `
            <div class="empty-state">
                <span class="emoji">📊</span>
                <p>No insights yet</p>
                <p>Log a few moods to see patterns!</p>
            </div>
        `;
        return;
    }

    const insightsHTML = `
        <div class="insights-summary">
            <p><strong>Total entries:</strong> ${data.totalEntries}</p>
        </div>
        <ul>
            ${data.insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
    `;
    
    insightsContent.innerHTML = insightsHTML;
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    loadMoodHistory();
    loadInsights();
}, 30000);
