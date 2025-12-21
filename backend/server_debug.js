const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Debug Server Running"));

const PORT = 5001;
app.listen(PORT, () => console.log(`Debug Server running on ${PORT}`));
