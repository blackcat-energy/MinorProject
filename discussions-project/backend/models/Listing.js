   // models/Listing.js
   const mongoose = require('mongoose');

   const listingSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String, required: true },
     price: { type: Number, required: true },
     category: { type: String, required: true, enum: ['Furniture', 'Room Listings', 'Textbooks', 'Electronics', 'Sports Equipment', 'Other Items'] },
     condition: { type: String, required: true, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'] },
     location: { type: String, required: true }, // Ensure this field is included
     images: [{ type: String }],
     contactPreference: { type: String, required: true },
     phone: { type: String },
     seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     createdAt: { type: Date, default: Date.now }
   });

   module.exports = mongoose.model('Listing', listingSchema);