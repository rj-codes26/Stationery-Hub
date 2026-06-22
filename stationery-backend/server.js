require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("API Running");
});
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend working"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});