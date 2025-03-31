import { Request, Response } from 'express';
import pool from '../db/pool';
import { AuthenticatedRequest } from '../middleware/authenticate';

// add new watchlist
export const createWatchlist = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  const { name, notes } = req.body;

  console.log(`POST request to /watchlists`);

  if (!user_id || !name) {
    return res.status(400).json({ error: 'user_id and name are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO watchlists (user_id, name, notes) VALUES ($1, $2, $3) RETURNING *',
      [user_id, name, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log('Error creating watchlist', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// list all watchlists created by specific user
export const watchlistsByUser = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;

  console.log(`GET request to /watchlists/me`);

  if (!user_id) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  try {
    const result = await pool.query(
      'SELECT watchlist_id, name, notes FROM watchlists WHERE user_id = $1',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching watchlists', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// modify specific watchlist data
export const modifyWatchlist = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  const watchlist_id = parseInt(req.params.id, 10);
  const { name, notes } = req.body;

  console.log(`PUT request to /watchlists/${watchlist_id}`);

  if (!user_id || isNaN(watchlist_id)) {
    return res.status(400).json({ error: 'Invalid user or watchlist id' });
  }

  if (!name && !notes) {
    return res.status(400).json({ error: 'Nothing to update' });
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

    // dynamic query
    const fields = [];
    const values = [watchlist_id];

    if (name) {
      fields.push(`name = $${values.length + 1}`);
      values.push(name);
    }

    if (notes) {
      fields.push(`notes = $${values.length + 1}`);
      values.push(notes);
    }

    const updateQuery = `UPDATE watchlists SET ${fields.join(',')} WHERE watchlist_id = $1 RETURNING *;`;
    const result = await pool.query(updateQuery, values);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating watchlist', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// delete specific watchlist
export const deleteWatchlist = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;
  const watchlist_id = parseInt(req.params.id, 10);

  console.log(`DELETE request to /watchlists/${watchlist_id}`);

  if (!user_id || isNaN(watchlist_id)) {
    return res.status(400).json({ error: 'Invalid user or watchlist id' });
  }

  try {
    const check = await pool.query(
      'SELECT * FROM watchlists WHERE watchlist_id = $1 AND user_id = $2',
      [watchlist_id, user_id]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Watchlist not found or not owned by you' });
    }

    await pool.query('DELETE FROM watchlists WHERE watchlist_id = $1 AND user_id = $2', [
      watchlist_id,
      user_id,
    ]);

    res.json({ message: 'Watchlist deleted successfully' });
  } catch (err) {
    console.error('Error deleting watchlist', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// see all watchlist
export const getWatchlists = async (req: Request, res: Response) => {
  console.log(`GET request to /watchlists`);

  try {
    const result = await pool.query(
      'SELECT watchlist_id, user_id, name, notes FROM watchlists ORDER BY watchlist_id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all watchlists', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
