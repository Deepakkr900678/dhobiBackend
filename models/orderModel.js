const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
    },
    providerId: {
        type: String,
    },
    items: [{
        name: {
            type: String, 
            required: true,
        },
        quantity: {
            type: Number,  
            required: true,
        }
    }],
    pickupAddress: {
        type: String,
    },
    deliveryAddress: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in_progress', 'ready', 'delivered', 'cancelled'],
        default: 'pending',
    },
    pickupTime: {
        type: String,
    },
    deliveryTime: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    amount: {
        type: String,
    }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
