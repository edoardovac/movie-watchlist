import { Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/authenticate';

const isPasswordStrong = (password: string): boolean => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
  );
};

// add new user
export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log(`POST request to /users`);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (!isPasswordStrong(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
    });
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

  console.log(`POST request to /login`);

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

  console.log(`GET request to /me`);

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

// delete user
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.user_id;

  console.log(`DELETE request to /users/${user_id}`);

  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT user_id, username FROM users ORDER BY user_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const deleteUserNoAuth = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id, 10);

  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING user_id, username',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
