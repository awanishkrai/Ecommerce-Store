//seedData.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
];

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
    image: "🎧",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Smart Fitness Watch",
    price: 199.99,
    description:
      "Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 7-day battery life.",
    image: "⌚",
    category: "Wearables",
    stock: 15,
  },
  {
    name: "Ergonomic Laptop Stand",
    price: 29.99,
    description:
      "Adjustable aluminum laptop stand for better ergonomics and improved airflow.",
    image: "💻",
    category: "Office",
    stock: 50,
  },
  {
    name: "Wireless Charging Phone Case",
    price: 24.99,
    description:
      "Protective phone case with built-in wireless charging capability and drop protection.",
    image: "📱",
    category: "Accessories",
    stock: 35,
  },
  {
    name: "LED Desk Lamp with USB Charging",
    price: 45.99,
    description:
      "Adjustable LED desk lamp with multiple brightness levels, color temperature control, and USB charging port.",
    image: "💡",
    category: "Office",
    stock: 20,
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 89.99,
    description:
      "RGB backlit mechanical gaming keyboard with blue switches and programmable keys.",
    image: "⌨️",
    category: "Gaming",
    stock: 12,
  },
  {
    name: "Wireless Gaming Mouse",
    price: 59.99,
    description:
      "High-precision wireless gaming mouse with customizable DPI and RGB lighting.",
    image: "🖱️",
    category: "Gaming",
    stock: 18,
  },
  {
    name: "Portable Bluetooth Speaker",
    price: 39.99,
    description:
      "Compact waterproof Bluetooth speaker with 12-hour battery and powerful bass.",
    image: "🔊",
    category: "Audio",
    stock: 30,
  },
];

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log("✅ Users imported successfully");

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log("✅ Products imported successfully");

    console.log("🎉 Data import completed successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("🗑️  Data destroyed successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
