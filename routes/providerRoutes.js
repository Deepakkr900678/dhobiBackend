const express = require('express');
const router = express.Router();
const { getProfile,getProviders, updateProfile, toggleActive, getOrders, updateOrderStatus, getAnalytics, createProvider, getProfileById } = require('../controllers/providerController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/create', createProvider);
router.get('/', getProviders);
router.get('/profile/:id', getProfile);
router.patch('/profile', updateProfile);
router.patch('/toggle-active', toggleActive);
router.get('/orders', getOrders);
router.patch('/order/:id/status', updateOrderStatus);
router.get('/analytics', getAnalytics);

module.exports = router;
