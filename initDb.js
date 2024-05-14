// initDb.js
import bcrypt from 'bcrypt';
import pool from './db.js';

const createTables = async () => {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) CHECK (type IN ('Normal', 'VIP')),
                UNIQUE(category_id, name)
            );

            CREATE TABLE IF NOT EXISTS service_price_options (
                id SERIAL PRIMARY KEY,
                service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
                duration VARCHAR(50) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                type VARCHAR(50) CHECK (type IN ('Hourly', 'Weekly', 'Monthly'))
            );
        `);

        const hashedPassword = await bcrypt.hash('Admin123!@#', 10);

        await client.query(`
            INSERT INTO users (email, password)
            VALUES ('admin@codesfortomorrow.com', $1)
            ON CONFLICT (email) DO NOTHING;
        `, [hashedPassword]);

        console.log('Tables created and admin user added successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        client.release();
    }
};

createTables().catch(console.error);
