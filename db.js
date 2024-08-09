const mongoose = require("mongoose");
require("dotenv").config();

// URL of the MongoDB server
const mongoURL = process.env.MONGODB_URL;

// Connect to the MongoDB server
mongoose.connect(mongoURL);

// Get the default connection
const db = mongoose.connection;

// Event listener for successful connection
db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

// Event listener for connection errors
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Event listener for disconnection
db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Export the connection object
module.exports = db;
