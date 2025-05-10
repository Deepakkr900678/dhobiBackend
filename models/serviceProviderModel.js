const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    businessName: {
      type: String,
    },
    servicesOffered: {
      type: String,
    },
    pricing: {
      shirt: {
        type: Number,
      },
      trouser: {
        type: Number,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    isApproved: {
      type: String,
      default: "pending",
    },
    isActive: {
      type: String,
      default: "true",
    },
    earnings: {
      type: String,
    },
  },
  { timestamps: true }
);

const ServiceProviderModel = mongoose.model(
  "ServiceProvider",
  ServiceProviderSchema
);
module.exports = ServiceProviderModel;
