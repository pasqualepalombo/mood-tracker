# Mood Tracker

App web per segnare l’umore e vedere correlazioni col meteo.

App disponibile in deploy su: https://mood-tracker-tau-five.vercel.app/
## Funzioni

* Segni il tuo umore (6 tipi + note opzionali)
* Meteo salvato in automatico
* Timeline con storico
* Piccole statistiche tra meteo e umore
* Funziona su desktop e mobile

## Setup

1. Serve **Node.js 14+** e una **API key OpenWeatherMap**
2. Installa dipendenze:

   ```bash
   cd backend
   npm install
   ```
3. Imposta variabili:

   ```bash
   export WEATHER_API_KEY="tua_api_key"
   ```
4. Avvia server:

   ```bash
   npm start
   ```
5. Apri `http://localhost:3000`

## API

* `POST /api/mood` → salva mood + meteo
* `GET /api/moods` → lista di tutti gli umori
* `GET /api/insights` → statistiche

## Deploy

* **Backend**: Railway/Render/Heroku
* **Frontend**: Netlify/Vercel (cartella `frontend/`, proxy su `/api`)

## Tech

* Node.js + Express
* HTML/CSS/JS
* Storage su JSON (si può passare a DB)
* OpenWeatherMap API
