const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin)
        return res
          .status(401)
          .json({ message: "Not authorized, admin not found" });

      req.admin = admin;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Admin token expired" });
      }
      return res.status(401).json({ message: "Invalid admin token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = adminProtect;
