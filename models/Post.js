const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    media: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Post', postSchema);