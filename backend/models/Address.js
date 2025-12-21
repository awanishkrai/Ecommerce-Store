const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: Number, required: true },
    country: { type: String, required: true },
    type: {
      type: String,
      enum: ["shipping", "billing"],
      default: "shipping",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);

