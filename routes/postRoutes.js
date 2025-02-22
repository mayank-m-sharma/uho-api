const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Create post
router.post('/', auth, upload.single('media'), async (req, res) => {
    try {
        const { caption, category } = req.body;
        
        // Validate required fields
        if (!req.file || !category) {
            return res.status(400).json({ 
                message: 'Media file and category are required' 
            });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        // Determine media type
        const mediaType = req.file.mimetype.startsWith('image') 
            ? 'image' 
            : 'video';

        // Create new post
        const post = new Post({
            caption,
            media: req.file.path,
            mediaType,
            category,
            user: req.user.id,
            likes: [],
            comments: []
        });

        await post.save();

        // Populate user and category details
        const populatedPost = await Post.findById(post._id)
            .populate('user', 'username email')
            .populate('category', 'name');

        res.status(201).json(populatedPost);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get feed posts (personalized)
router.get('/feed', auth, async (req, res) => {
    try {
        // In real app, implement personalized feed logic based on user interests
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username avatar')
            .populate('category', 'name')
            .limit(20);

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Explore posts with filters
router.get('/explore', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = {};

        if (category) {
            filter.category = category;
        }

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .populate('user', 'username')
            .populate('category', 'name')
            .limit(50);

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router; 