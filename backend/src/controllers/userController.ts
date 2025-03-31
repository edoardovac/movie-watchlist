import { Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/authenticate';

// add new user
export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id, username',
      [username, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err != null &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      return res.status(409).json({ error: 'Username already exists.' });
    }
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// login
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        username: user.username,
      },
      token: token,
    });
  } catch (err) {
    console.log('Login error', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// user info
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;

  try {
    const result = await pool.query('SELECT user_id, username FROM users WHERE user_id = $1', [
      user_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
