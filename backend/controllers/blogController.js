const Blog = require('../models/BlogModel');

const getAllBlogs = async (req, res) => {
  try {
    let blogs = await Blog.find().sort({ publishedAt: -1 });

    // Seed with sample blogs if empty
    if (!blogs || blogs.length === 0) {
      const sample = [];
      const categories = ['Nutrition','Fitness','Mental Health','Women\'s Health','Child Care','Heart Health','Diabetes','Lifestyle','Medical News'];
      for (let i = 1; i <= 18; i++) {
        sample.push({
          title: `HealthConnect Insight ${i}: Practical Advice for Patients`,
          description: `A concise overview of important health topic #${i}. Learn practical tips and evidence-based guidance.`,
          content: `This is a seeded blog post number ${i}. It covers key advice, recommended tests, and lifestyle modifications relevant to general health and wellness. Use this content as an example article for the HealthConnect platform.`,
          author: `Health Team`,
          category: categories[i % categories.length],
          image: '',
          readTime: `${4 + (i % 6)} min read`,
        });
      }
      await Blog.insertMany(sample);
      blogs = await Blog.find().sort({ publishedAt: -1 });
    }

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
