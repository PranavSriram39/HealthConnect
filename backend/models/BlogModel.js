const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Nutrition',
      'Fitness',
      'Mental Health',
      'Women\'s Health',
      'Child Care',
      'Heart Health',
      'Diabetes',
      'Lifestyle',
      'Medical News',
    ],
  },
  image: { type: String, default: '' },
  readTime: { type: String, default: '5 min read' },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
