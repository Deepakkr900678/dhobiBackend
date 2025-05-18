const ServiceProvider = require("../models/serviceProviderModel");
const Order = require("../models/orderModel");
// Create a new service provider
exports.createProvider = async (req, res) => {
  try {
    const provider = new ServiceProvider(req.body);
    await provider.save();
    res.status(201).json({ message: "Service provider created", provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/provider
exports.getProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    res.status(200).json({ providers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/provider/profile
exports.getProfile = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ _id: req.params.id });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });
    res.status(200).json({ provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/provider/profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const provider = await ServiceProvider.findOneAndUpdate(
      { _id: req.params.id },
      updates,
      { new: true }
    );
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });
    res.status(200).json({ message: "Profile updated", provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.activeProvider = async (req, res) => {
  try {
    const updates = req.body;
    const provider = await ServiceProvider.findOneAndUpdate(
      { _id: req.params.id },
      updates,
      { new: true }
    );
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });
    res.status(200).json({ message: "Profile updated", provider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/provider/toggle-active
exports.toggleActive = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ _id: req.params.id });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    provider.isActive = provider.isActive === true ? false : true;
    await provider.save();

    res.status(200).json({
      message: `Provider is now ${
        provider.isActive === "true" ? "active" : "inactive"
      }`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/provider/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ providerId: req.user.userId });
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/provider/order/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: id},
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/provider/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user.userId });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const orders = await Order.find({ providerId: req.user.userId });
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;
    const earnings = provider.earnings || "0";

    res.status(200).json({
      totalOrders,
      completedOrders,
      earnings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
