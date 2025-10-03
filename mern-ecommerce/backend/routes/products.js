// backend/routes/products.js
const express = require("express");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth"); // user auth
const adminProtect = require("../middleware/adminAuth"); // admin auth
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Create 'uploads' folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// ------------------ PUBLIC ROUTES ------------------

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ------------------ ADMIN ROUTES ------------------

// Create product (Admin)
router.post("/", protect, adminProtect, async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      stock,
      inStock: stock > 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid product data", error: error.message });
  }
});

// Update product (Admin)
router.put("/:id", protect, adminProtect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;
    product.category = req.body.category || product.category;
    product.stock =
      req.body.stock !== undefined ? req.body.stock : product.stock;
    product.inStock = product.stock > 0;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
});

// Delete product (Admin)
router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// Upload product image (Admin)
router.post(
  "/upload",
  protect,
  adminProtect,
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const imagePath = `/uploads/${req.file.filename}`;
    res.status(201).json({ image: imagePath });
  }
);

module.exports = router;
