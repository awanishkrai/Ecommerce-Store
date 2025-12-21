const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Admin = require("../models/Admin");
const { protect } = require("../middleware/auth"); // user auth
const adminProtect = require("../middleware/adminAuth"); // admin auth

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!shippingAddress || !shippingAddress._id) {
      return res
        .status(400)
        .json({ message: "Please provide a shipping address" });
    }

    // Verify stock availability for all items
    const stockErrors = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        stockErrors.push(`Product ${item.name} not found`);
      } else if (!product.inStock) {
        stockErrors.push(`${item.name} is out of stock`);
      } else if (product.stock < item.quantity) {
        stockErrors.push(
          `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }
    }

    if (stockErrors.length > 0) {
      return res.status(400).json({
        message: "Stock verification failed",
        errors: stockErrors,
      });
    }

    // Update stock for each product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });

      // Update inStock status if stock reaches 0
      const updatedProduct = await Product.findById(item.product);
      if (updatedProduct.stock <= 0) {
        updatedProduct.inStock = false;
        await updatedProduct.save();
      }
    }

    // Create the order
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
router.get("/:id", async (req, res) => {
  try {
    // Check if admin token is provided
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    let userId = null;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if it's an admin token
        const admin = await Admin.findById(decoded.id);
        if (admin) {
          isAdmin = true;
        } else {
          // Check if it's a user token
          const user = await User.findById(decoded.id);
          if (user) {
            userId = user._id;
          }
        }
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } else {
      return res.status(401).json({ message: "No token provided" });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price image")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check authorization: either admin or order owner
    if (!isAdmin && (!userId || order.user._id.toString() !== userId.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
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
router.get("/", adminProtect, async (req, res) => {
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
router.put("/:id/status", adminProtect, async (req, res) => {
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
