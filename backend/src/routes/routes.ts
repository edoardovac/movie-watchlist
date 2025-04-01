import express from 'express';
import {
  createUser,
  deleteUser,
  deleteUserNoAuth,
  getMe,
  listUsers,
  loginUser,
} from '../controllers/userController';
import {
  addMovieToWatchlist,
  getMoviesInWatchlist,
  markAsWatched,
  markAsUnwatched,
  removeMovieFromWatchlist,
} from '../controllers/movieController';
import {
  createWatchlist,
  deleteWatchlist,
  getWatchlists,
  modifyWatchlist,
  watchlistsByUser,
} from '../controllers/watchlistController';
import { authenticateToken } from '../middleware/authenticate';

const router = express.Router();

// test connection
router.get('/hello', (req, res) => {
  console.log(`GET request to /hello`);
  res.send('Hello from backend');
});

// users routes
router.post('/users', createUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getMe);
router.delete('/users', authenticateToken, deleteUser);
router.get('/users', listUsers);
router.delete('/users/:id', deleteUserNoAuth);

// watchlists routes
router.post('/watchlists', authenticateToken, createWatchlist);
router.get('/watchlists/me', authenticateToken, watchlistsByUser);
router.put('/watchlists/:id', authenticateToken, modifyWatchlist);
router.delete('/watchlists/:id', authenticateToken, deleteWatchlist);
router.get('/watchlists', getWatchlists);

// movies routes
router.post('/watchlists/:id/movies', authenticateToken, addMovieToWatchlist);
router.delete(
  '/watchlists/:watchlist_id/movies/:movie_id',
  authenticateToken,
  removeMovieFromWatchlist
);
router.get('/watchlists/:watchlist_id/movies', authenticateToken, getMoviesInWatchlist);
router.patch(
  '/watchlists/:watchlist_id/movies/:movie_id/watched',
  authenticateToken,
  markAsWatched
);
router.patch(
  '/watchlists/:watchlist_id/movies/:movie_id/unwatched',
  authenticateToken,
  markAsUnwatched
);
export default router;
