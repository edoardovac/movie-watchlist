# movie-watchlist

**movie-watchlist** is a full-stack mobile application powered by a PostgreSQL database. It allows users to search for movies, organize them into custom watchlists, and track their watched status. Built with **React Native (Expo)** on the frontend and **Node.js (TypeScript)** on the backend, it integrates with the **TMDB API** and supports user authentication, persistent theming, and a responsive UI.

---

## Project Structure

```
├── frontend/         # React Native (Expo) app
│   └── src/          # Screens, components, API hooks, utils, etc.
│   └──.env           # Environment configuration (frontend)
├── backend/          # Node.js backend (TypeScript)
│   └── src/          # Routes, controllers, DB, middleware
│   └──schema.sql     # SQL schema for PostgreSQL
│   └──init-db.ts     # Optional script to initialize the DB
│   └──.env           # Environment configuration (backend)
└── docker-compose.yml

```

---

## Features

- Search movies using the TMDB API
- Create multiple personalized watchlists
- Mark movies as watched/unwatched
- Remove movies from lists via swipe gestures
- Sort by title, year, rating, runtime, etc.
- Light/Dark theme toggle (persistent via AsyncStorage)
- Optional tutorial for new users
- Token-based authentication (stored securely)
- Backend connectivity test from settings
- Genres are stored in the database schema, but are not yet implemented in the frontend UI.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Docker + Docker Compose
- Expo CLI (`npm install -g expo-cli`)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-watchlist.git
cd movie-watchlist
```

### 2. Set up environment variables

Create a `.env` file in both `frontend/` and `backend/`.

**backend/.env**

```
TMDB_API_KEY=             # Obtainable from TMDB website
JWT_SECRET=               # Your own secret key for token signing
```

**frontend/.env**

```
API_URL=                  # If running locally, run `ipconfig` or `ifconfig` to determine your IP
TMDB_API_KEY=             # Same key as backend, obtainable from TMDB website
TMDB_API_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w185
```

**Note:** To run the backend, database, and Expo frontend locally, ensure your laptop and mobile device are connected to the same Wi-Fi network.

### 3. Start backend services

Make sure Docker is running, then:

```bash
docker-compose up
```

Or, to run manually with local Postgres:

```bash
cd backend
npm install
npm run dev
```

Initialize the database:

```bash
npx ts-node init-db.ts
```

### 4. Start frontend

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with your Expo Go app or open in a simulator.

---

## Testing

- Login/Register a user
- Search for a movie and add it to a watchlist
- Toggle watched status or delete via swipe
- Use the drawer menu to switch between Home and Settings
- Test theme toggle and backend connection
- Access the tutorial via Settings > Show Welcome Tutorial

---

## Code Quality

- ESLint and Prettier configured
- Strict typing with TypeScript across frontend and backend
- Modular folder structure for scalability

---

## Authentication Tokens

The application utilizes authentication tokens to secure user sessions.
Upon successful login, a token is generated and stored securely on the device.
This token is then used for subsequent authenticated requests to the backend.

It is important to handle these tokens securely to maintain user privacy and data integrity.

---

## Notes

- Genres: While the database schema includes provisions for movie genres, this feature has not been implemented in the current version of the application.

- Persistent Theming: Theme preferences are stored using AsyncStorage, ensuring that user selections persist across sessions.

- Tutorial Dialog: The introductory tutorial is displayed upon the first launch and can be revisited via the settings screen.

---

## Acknowledgments

- [TMDB API](https://www.themoviedb.org/) for movie data
- [React Native Paper](https://callstack.github.io/react-native-paper/) for UI components

---

## License

This project is for demonstration purposes only and does not carry a specific license.
