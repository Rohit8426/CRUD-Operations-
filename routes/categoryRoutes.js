import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/category', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const client = await pool.connect();
        const result = await client.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/categories', authMiddleware, async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM categories');
        client.release();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/category/:categoryId', authMiddleware, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        const client = await pool.connect();
        const result = await client.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, categoryId]);
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/category/:categoryId', authMiddleware, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const client = await pool.connect();
        const servicesResult = await client.query('SELECT * FROM services WHERE category_id = $1', [categoryId]);

        if (servicesResult.rows.length > 0) {
            client.release();
            return res.status(400).json({ error: 'Cannot delete category with services.' });
        }

        await client.query('DELETE FROM categories WHERE id = $1', [categoryId]);
        client.release();
        res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
