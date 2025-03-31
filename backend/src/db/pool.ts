import { Pool } from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/watchlist',
});

export default pool;
