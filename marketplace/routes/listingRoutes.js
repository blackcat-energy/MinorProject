const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const auth = require('../../middleware/auth'); // Assuming you have auth middleware

// Public routes
router.get('/listings', listingController.getListings);
router.get('/listings/:id', listingController.getListing);

// Protected routes (require authentication)
router.post('/listings', auth, listingController.createListing);
router.put('/listings/:id', auth, listingController.updateListing);
router.delete('/listings/:id', auth, listingController.deleteListing);
router.get('/my-listings', auth, listingController.getUserListings);

module.exports = router; 