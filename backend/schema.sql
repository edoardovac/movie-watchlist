-- Users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- Movies
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    tmdb_id INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    overview TEXT,
    poster_path TEXT,
    release_date DATE,
    runtime INT,
    tagline TEXT,
    vote_average FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Genres
CREATE TABLE genres (
    -- genre_id is not serial as it's using TMDB's genre_id
    genre_id INT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Movie-Genre join table (m:n)
CREATE TABLE movie_genres (
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- Watchlists
CREATE TABLE watchlists (
    watchlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    notes TEXT
);

-- Watchlist-Movie mapping
CREATE TABLE watchlist_movies (
    watchlist_movies_id SERIAL PRIMARY KEY,
    watchlist_id INT REFERENCES watchlists(watchlist_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    watched BOOLEAN DEFAULT FALSE,
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (watchlist_id, movie_id)
);

-- FK indexes
CREATE INDEX idx_watchlist_user ON watchlists(user_id);
CREATE INDEX idx_watchlist_movie ON watchlist_movies(watchlist_id);
CREATE INDEX idx_movie_genre_movie ON movie_genres(movie_id);
CREATE INDEX idx_movie_genre_genre ON movie_genres(genre_id);