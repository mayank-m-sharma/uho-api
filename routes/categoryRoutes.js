const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');

// Create category (admin only)
router.post('/', auth, adminCheck, async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if category exists
        let category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        // Create new category
        category = new Category({
            name,
            description,
            createdBy: req.user.id
        });

        await category.save();

        res.status(201).json({
            _id: category.id,
            name: category.name,
            description: category.description,
            createdBy: category.createdBy
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username email');

        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router; 