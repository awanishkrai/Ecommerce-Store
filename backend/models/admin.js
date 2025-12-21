// models/Admin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/*
 NOTE:
 - matchPassword below supports both hashed and plain passwords for backward compatibility.
 - New admins will have hashed passwords.
*/

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password: support both bcrypt-hashed and plain-text stored passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;

  // If stored password looks like a bcrypt hash, verify with bcrypt
  if (typeof this.password === "string" && this.password.startsWith("$2")) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (err) {
      return false;
    }
  }

  // Otherwise do a direct comparison (plain-text)
  return enteredPassword === this.password;
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
