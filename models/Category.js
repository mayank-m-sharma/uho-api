const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Category', categorySchema); 