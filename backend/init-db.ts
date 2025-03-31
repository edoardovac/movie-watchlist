import fs from 'fs';
import { Pool } from 'pg';

const schema = fs.readFileSync('schema.sql', 'utf8');
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@127.0.0.1:5432/watchlist',
});

pool
  .query(schema)
  .then(() => {
    console.log('Database initialized');
    return pool.end();
  })
  .catch((err: unknown) => {
    console.error('Error initializing DB:', err);
    process.exit(1);
  });
