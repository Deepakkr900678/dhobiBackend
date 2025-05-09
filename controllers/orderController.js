const Order = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');

// POST /api/order/create
exports.createOrder = async (req, res) => {
    try {
        const {
            providerId,
            items,
            pickupAddress,
            deliveryAddress,
            pickupTime,
            deliveryTime,
            amount
        } = req.body;

        if (!providerId || !items || !pickupAddress || !deliveryAddress || !pickupTime || !deliveryTime || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const order = await Order.create({
            orderId: uuidv4(),
            providerId,
            items,
            pickupAddress,
            deliveryAddress,
            pickupTime,
            deliveryTime,
            amount,
            status: 'pending',
            paymentStatus: 'pending'
        });

        res.status(201).json({ message: 'Order created successfully', order });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/order/user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId });
        res.status(200).json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/order/provider
exports.getProviderOrders = async (req, res) => {
    try {
        const orders = await Order.find({ providerId: req.user.userId });
        res.status(200).json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH /api/order/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'accepted', 'in_progress', 'ready', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order status updated', order });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/order/:id
exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
