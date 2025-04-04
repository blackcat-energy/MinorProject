const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all listing routes
router.use(authMiddleware);

// @route   GET api/listings
// @desc    Get all listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('Received request for listings with params:', req.query);
    
    const { category, page = 1, limit = 10, search = '' } = req.query;
    
    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('MongoDB query:', query);
    
    // Get listings
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('seller', 'userName email');

    console.log(`Found ${listings.length} listings`);

    // Get total count
    const total = await Listing.countDocuments(query);
    console.log(`Total listings: ${total}`);

    res.json({
      success: true,
      listings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    console.error('Error in GET /listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message
    });
  }
});

// @route   GET api/listings/:id
// @desc    Get listing by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', ['username', 'email']);
    
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/listings
// @desc    Create a listing
// @access  Private
router.post('/', async (req, res) => {
  try {
    console.log('Received listing data:', req.body);
    console.log('User session:', req.session);
    console.log('User ID:', req.session.user._id);

    const listing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      condition: req.body.condition,
      location: req.body.location,
      contactPreference: req.body.contactPreference,
      phone: req.body.phone,
      seller: req.session.user._id,
      images: [] // Initialize empty images array
    });

    console.log('Created listing object:', listing);

    const savedListing = await listing.save();
    console.log('Saved listing:', savedListing);
    
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: savedListing
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating listing',
      error: error.message
    });
  }
});

// @route   PUT api/listings/:id
// @desc    Update a listing
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    
    // Check user
    if (listing.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Build listing object
    const listingFields = {};
    if (req.body.title) listingFields.title = req.body.title;
    if (req.body.description) listingFields.description = req.body.description;
    if (req.body.price) listingFields.price = req.body.price;
    if (req.body.category) listingFields.category = req.body.category;
    if (req.body.condition) listingFields.condition = req.body.condition;
    if (req.body.location) listingFields.location = req.body.location;
    if (req.body.images) listingFields.images = req.body.images;
    if (req.body.contactInfo) listingFields.contactInfo = req.body.contactInfo;
    
    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: listingFields },
      { new: true }
    );
    
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/listings/:id
// @desc    Delete a listing
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    
    // Check user
    if (listing.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await listing.remove();
    
    res.json({ msg: 'Listing removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;