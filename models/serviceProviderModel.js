const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
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
            required: true,
        },
        trouser: {
            type: Number,
            required: true,
        },
    },
    images: [{
        type: String,
    }],
    isApproved: {
        type: String,
    },
    isActive: {
        type: String,
    },
    earnings: {
        type: String,
    },
}, { timestamps: true });

const ServiceProviderModel = mongoose.model('ServiceProvider', ServiceProviderSchema);
module.exports = ServiceProviderModel;
