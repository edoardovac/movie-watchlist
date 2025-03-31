import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate';
import pool from '../db/pool';

// add movie to watchlist
export const addMovieToWatchlist = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  const watchlist_id = parseInt(req.params.id, 10);

  const { tmdb_id, title, overview, poster_path, release_date, runtime, tagline, vote_average } =
    req.body;

  if (!user_id || !watchlist_id || !tmdb_id || !title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // check ownership
    const check = await pool.query(
      'SELECT * FROM watchlists WHERE watchlist_id = $1 AND user_id = $2',
      [watchlist_id, user_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied or watchlist not found' });
    }

    // check if movie in db already
    const movieCheck = await pool.query('SELECT movie_id FROM movies WHERE tmdb_id = $1', [
      tmdb_id,
    ]);

    let movie_id;
    if (movieCheck.rows.length > 0) {
      movie_id = movieCheck.rows[0].movie_id;
    } else {
      const insertMovie = await pool.query(
        `INSERT INTO movies (tmdb_id, title, overview, poster_path, release_date, runtime, tagline, vote_average)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING movie_id`,
        [tmdb_id, title, overview, poster_path, release_date, runtime, tagline, vote_average]
      );
      movie_id = insertMovie.rows[0].movie_id;
    }

    // add to specific watchlist
    const insertLink = await pool.query(
      `INSERT INTO watchlist_movies (watchlist_id, movie_id)
       VALUES ($1, $2)
       ON CONFLICT (watchlist_id, movie_id) DO NOTHING
       RETURNING *`,
      [watchlist_id, movie_id]
    );

    if (insertLink.rows.length === 0) {
      return res.status(409).json({ message: 'Movie already in watchlist' });
    }

    res.status(201).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    console.error('Error adding movie to watchlist', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// remove movie from watchlist
export const removeMovieFromWatchlist = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  const watchlist_id = parseInt(req.params.watchlist_id, 10);
  const movie_id = parseInt(req.params.movie_id, 10);

  if (isNaN(watchlist_id) || isNaN(movie_id)) {
    return res.status(400).json({ error: 'Invalid watchlist or movie ID' });
  }

  try {
    // check owner
    const check = await pool.query(
      'SELECT * FROM watchlists WHERE watchlist_id = $1 AND user_id = $2',
      [watchlist_id, user_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied or watchlist not found' });
    }

    // delete movie
    const result = await pool.query(
      'DELETE FROM watchlist_movies WHERE watchlist_id = $1 AND movie_id = $2 RETURNING *',
      [watchlist_id, movie_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    console.error('Error deleting movie from watchlsit', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// list all movies in a watchlist
export const getMoviesInWatchlist = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.user_id;
  const watchlist_id = parseInt(req.params.watchlist_id, 10);

  if (isNaN(watchlist_id)) {
    return res.status(400).json({ error: 'Invalid watchlist id' });
  }

  try {
    // check owner
    const check = await pool.query(
      'SELECT * FROM watchlists WHERE watchlist_id = $1 AND user_id = $2',
      [watchlist_id, user_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied or watchlist not found' });
    }

    const result = await pool.query(
      `SELECT m.movie_id, m.tmdb_id, m.title, m.overview, m.poster_path, wm.watched
       FROM watchlist_movies wm
       JOIN movies m ON wm.movie_id = m.movie_id
       WHERE wm.watchlist_id = $1`,
      [watchlist_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies in watchlist:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// change to watched
export const markAsWatched = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  const watchlist_id = parseInt(req.params.watchlist_id, 10);
  const movie_id = parseInt(req.params.movie_id, 10);

  if (isNaN(watchlist_id)) {
    return res.status(400).json({ error: 'Invalid watchlist id' });
  }

  try {
    // check owner
    const check = await pool.query(
      'SELECT * FROM watchlists WHERE watchlist_id = $1 AND user_id = $2',
      [watchlist_id, user_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied or watchlist not found' });
    }
    const result = await pool.query(
      `UPDATE watchlist_movies
       SET watched = TRUE
       WHERE watchlist_id = $1 AND movie_id = $2
       RETURNING *`,
      [watchlist_id, movie_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    res.json({ message: 'Movie marked as watched', movie: result.rows[0] });
  } catch (err) {
    console.error('Error marking movie as watched:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// change to unwatched
export const markAsUnwatched = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  const watchlist_id = parseInt(req.params.watchlist_id, 10);
  const movie_id = parseInt(req.params.movie_id, 10);

  if (isNaN(watchlist_id)) {
    return res.status(400).json({ error: 'Invalid watchlist id' });
  }

  try {
    // check owner
    const check = await pool.query(
      'SELECT * FROM watchlists WHERE watchlist_id = $1 AND user_id = $2',
      [watchlist_id, user_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied or watchlist not found' });
    }
    const result = await pool.query(
      `UPDATE watchlist_movies
       SET watched = FALSE
       WHERE watchlist_id = $1 AND movie_id = $2
       RETURNING *`,
      [watchlist_id, movie_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    res.json({ message: 'Movie marked as watched', movie: result.rows[0] });
  } catch (err) {
    console.error('Error marking movie as watched:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
