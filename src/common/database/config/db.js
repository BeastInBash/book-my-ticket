import pg from 'pg'
import 'dotenv/config'
export const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "cohort",
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
});
