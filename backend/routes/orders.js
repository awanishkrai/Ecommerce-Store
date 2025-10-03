const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/auth"); // user auth
const adminProtect = require("../middleware/adminAuth"); // admin auth

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
router.post("/", protect, async (req, res) => {
  try {
    console.log("req.user:", req.user._id);
    console.log("req.body:", req.body);

    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!shippingAddress || !shippingAddress._id) {
      return res
        .status(400)
        .json({ message: "Please provide a shipping address" });
    }

    // Use logged-in user ID instead of body
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress: shippingAddress._id,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Order creation failed", error: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User who owns it OR Admin)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price image")
      .populate("shippingAddress");

    if (order) {
      // check ownership unless admin
      if (order.user._id.toString() !== req.user._id.toString() && !req.admin) {
        return res.status(403).json({ message: "Not authorized" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Get all orders for a given user ID
// @route   GET /api/orders/myorders/list
// @access  Private (User)
router.get("/myorders/list", protect, async (req, res) => {
  try {
    const userId = req.user._id; // always use logged-in user
    const orders = await Order.find({ user: userId })
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get("/", protect, adminProtect, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name price image")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private (User who owns it)
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "processing";

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put("/:id/status", protect, adminProtect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;

      if (req.body.status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
