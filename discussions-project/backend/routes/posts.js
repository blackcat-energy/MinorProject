const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Create new post
    const newPost = new Post({
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: req.user.id
    });

    const post = await newPost.save();
    
    // Populate author info
    await post.populate('author', 'username avatar');
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sort = req.query.sort || 'newest';
    let posts;
    
    switch(sort) {
      case 'newest':
        posts = await Post.find()
          .sort({ createdAt: -1 })
          .populate('author', 'username avatar');
        break;
      case 'top':
        posts = await Post.find()
          .sort({ upvotes: -1 })
          .populate('author', 'username avatar');
        break;
      case 'trending':
      default:
        // For trending, we'll use a combination of recency and votes
        posts = await Post.find()
          .sort({ createdAt: -1, upvotes: -1 })
          .populate('author', 'username avatar');
    }
    
    // For each post, count comments
    const postsWithCommentCount = await Promise.all(
      posts.map(async post => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post._doc,
          commentCount
        };
      })
    );
    
    res.json(postsWithCommentCount);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar');
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/vote
// @desc    Upvote or downvote a post
// @access  Private
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Handle upvote
    if (voteType === 'upvote') {
      // Check if already downvoted
      if (post.downvotes.includes(req.user.id)) {
        // Remove from downvotes
        post.downvotes = post.downvotes.filter(
          id => id.toString() !== req.user.id
        );
      }
      
      // Check if already upvoted
      if (post.upvotes.includes(req.user.id)) {
        // Remove upvote (toggle off)
        post.upvotes = post.upvotes.filter(
          id => id.toString() !== req.user.id
        );
      } else {
        // Add upvote
        post.upvotes.push(req.user.id);
      }
    }
    
    // Handle downvote
    if (voteType === 'downvote') {
      // Check if already upvoted
      if (post.upvotes.includes(req.user.id)) {
        // Remove from upvotes
        post.upvotes = post.upvotes.filter(
          id => id.toString() !== req.user.id
        );
      }
      
      // Check if already downvoted
      if (post.downvotes.includes(req.user.id)) {
        // Remove downvote (toggle off)
        post.downvotes = post.downvotes.filter(
          id => id.toString() !== req.user.id
        );
      } else {
        // Add downvote
        post.downvotes.push(req.user.id);
      }
    }
    
    await post.save();
    
    res.json({
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      score: post.upvotes.length - post.downvotes.length
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;