const mongoose = require("mongoose");
const adressSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);
module.exports = mongoose.model("Address", adressSchema);
