import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
import * as schema from './schema.js';

const DATABASE_URL = path.resolve('data', 'sqlite.db');

const db = drizzle(DATABASE_URL, {
    schema: schema,
    // logger: true
});

export default db;