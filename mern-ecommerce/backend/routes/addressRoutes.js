const express = require("express");
const Address = require("../models/Address");
const { protect } = require("../middleware/auth"); // user auth

const router = express.Router();

// ------------------ USER PROTECTED ROUTES ------------------

// Get all addresses for a user (by userId)
router.get("/user/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    // Only allow logged-in user to access their own addresses
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const addresses = await Address.find({ user: userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get a single address by its _id
router.get("/:id", protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add new address
router.post("/", protect, async (req, res) => {
  try {
    const newAddress = new Address({
      user: req.user._id, // use logged-in user's ID
      addressLine: req.body.addressLine,
      city: req.body.city,
      pinCode: req.body.pinCode,
      country: req.body.country,
    });

    const saved = await newAddress.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to add address", error: err.message });
  }
});

// Update address
router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Address not found" });
    res.json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update address", error: err.message });
  }
});

// Delete address
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Address deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete address", error: err.message });
  }
});

module.exports = router;
