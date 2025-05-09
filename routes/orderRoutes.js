const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getProviderOrders, updateOrderStatus, getOrderDetails } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/create', createOrder);
router.get('/user', getUserOrders);
router.get('/provider', getProviderOrders);
router.patch('/:id/status', updateOrderStatus);
router.get('/:id', getOrderDetails);

module.exports = router;
