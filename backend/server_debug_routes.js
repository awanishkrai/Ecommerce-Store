const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

console.log("Loading products...");
app.use("/api/products", require("./routes/products"));
console.log("Loading users...");
app.use("/api/users", require("./routes/users"));
console.log("Loading orders...");
app.use("/api/orders", require("./routes/orders"));
console.log("Loading addresses...");
app.use("/api/addresses", require("./routes/addressRoutes"));

console.log("Loading payment...");
app.use("/api/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => res.send("Debug Server Routes Running"));

const PORT = 5003;
app.listen(PORT, () => console.log(`Debug Server running on ${PORT}`));
