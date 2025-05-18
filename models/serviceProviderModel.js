const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    serviceAreas: {
      type: String,
      required: true,
    },
    // Add GeoJSON location field for geospatial queries
    location: {
      type: {
        type: String,
        enum: ['Point'], // Only accept 'Point' type
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    commissionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    services: [
      {
        name: String,
        price: String,
      },
    ],
    joinDate: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    ordersCompleted: {
      type: Number,
      default: 0,
    },
    pricing: {
      type: Map,
      of: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    isApproved: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    earnings: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
ServiceProviderSchema.index({ location: "2dsphere" });

const ServiceProvider = mongoose.model("ServiceProvider", ServiceProviderSchema);
module.exports = ServiceProvider;