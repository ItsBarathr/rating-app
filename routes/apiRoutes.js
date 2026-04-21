const express = require('express');
const router = express.Router();
const categoryModel = require('../models/categoryModel');
const shareLinkModel = require('../models/shareLinkModel');
const publicRatingModel = require('../models/publicRatingModel');
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');

router.get('/categories', async (req, res) => {
    try {
        const categories = await categoryModel.findAll();
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.get('/categories/:id', async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

router.post('/categories', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name required' });
        }
        const category = await categoryModel.create(name);
        res.status(201).json(category);
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

router.put('/categories/:id', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name required' });
        }
        const category = await categoryModel.update(req.params.id, name);
        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

router.delete('/categories/:id', authenticateToken, async (req, res) => {
    try {
        await categoryModel.delete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

router.get('/dashboard', authenticateToken, analyticsController.getDashboard);
router.get('/overview', authenticateToken, analyticsController.getOverview);
router.get('/analytics', authenticateToken, analyticsController.getCategoryAnalytics);
router.get('/activity', authenticateToken, analyticsController.getRecentActivity);

router.get('/share-links', authenticateToken, async (req, res) => {
    try {
        const links = await shareLinkModel.findAll();
        res.json({ links });
    } catch (error) {
        console.error('Get share links error:', error);
        res.status(500).json({ error: 'Failed to fetch share links' });
    }
});

router.post('/share-links', authenticateToken, async (req, res) => {
    try {
        const { category_id, title, description, expires_at } = req.body;
        if (!category_id) {
            return res.status(400).json({ error: 'Category ID required' });
        }
        const link = await shareLinkModel.create(category_id, title, description, expires_at);
        res.status(201).json(link);
    } catch (error) {
        console.error('Create share link error:', error);
        res.status(500).json({ error: 'Failed to create share link' });
    }
});

router.delete('/share-links/:id', authenticateToken, async (req, res) => {
    try {
        await shareLinkModel.delete(req.params.id);
        res.json({ message: 'Share link deleted' });
    } catch (error) {
        console.error('Delete share link error:', error);
        res.status(500).json({ error: 'Failed to delete share link' });
    }
});

router.get('/rate/:slug', async (req, res) => {
    try {
        const link = await shareLinkModel.findBySlug(req.params.slug);
        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }
        if (link.expires_at && new Date(link.expires_at) < new Date()) {
            return res.status(410).json({ error: 'Link expired' });
        }
        const stats = await publicRatingModel.getStatsByLink(link.id);
        res.json({ link, stats });
    } catch (error) {
        console.error('Get rate link error:', error);
        res.status(500).json({ error: 'Failed to fetch link' });
    }
});

router.post('/rate/:slug', async (req, res) => {
    try {
        const link = await shareLinkModel.findBySlug(req.params.slug);
        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }
        if (link.expires_at && new Date(link.expires_at) < new Date()) {
            return res.status(410).json({ error: 'Link expired' });
        }
        const { client_name, rating, comment } = req.body;
        if (!client_name || !rating) {
            return res.status(400).json({ error: 'Client name and rating required' });
        }
        const result = await publicRatingModel.create({
            share_link_id: link.id,
            category_id: link.category_id,
            client_name,
            rating,
            comment
        });
        res.status(201).json({ message: 'Rating submitted', rating: result });
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
});

module.exports = router;