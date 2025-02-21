const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');

// Create category (admin only)
router.post('/', auth, adminCheck, async (req, res) => {
    // ... implementation ...
});

// Get all categories
router.get('/', async (req, res) => {
    // ... implementation ...
});

module.exports = router; 