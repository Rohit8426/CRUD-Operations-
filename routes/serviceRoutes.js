import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/category/:categoryId/service', authMiddleware, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, type } = req.body;
        const client = await pool.connect();
        const result = await client.query('INSERT INTO services (category_id, name, type) VALUES ($1, $2, $3) RETURNING *', [categoryId, name, type]);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/category/:categoryId/services', authMiddleware, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM services WHERE category_id = $1', [categoryId]);
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/category/:categoryId/service/:serviceId', authMiddleware, async (req, res) => {
    try {
        const { categoryId, serviceId } = req.params;
        const { name, type } = req.body;
        const client = await pool.connect();
        const result = await client.query('UPDATE services SET name = $1, type = $2 WHERE id = $3 AND category_id = $4 RETURNING *', [name, type, serviceId, categoryId]);
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/category/:categoryId/service/:serviceId', authMiddleware, async (req, res) => {
    try {
        const { categoryId, serviceId } = req.params;
        const client = await pool.connect();
        await client.query('DELETE FROM services WHERE id = $1 AND category_id = $2', [serviceId, categoryId]);
        client.release();
        res.status(200).json({ message: 'Service deleted successfully.' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
