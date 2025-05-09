const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, toggleActive, getOrders, updateOrderStatus, getAnalytics } = require('../controllers/providerController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/toggle-active', toggleActive);
router.get('/orders', getOrders);
router.patch('/order/:id/status', updateOrderStatus);
router.get('/analytics', getAnalytics);

module.exports = router;
