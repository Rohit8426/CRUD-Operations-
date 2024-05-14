// db.js
import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'HrForCodes',
    password: 'Rohit@8426',
    port: 5432,
});

export default pool;

