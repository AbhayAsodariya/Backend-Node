const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // Import the MongoDB connection
require("dotenv").config();

const personRoutes = require("./routes/Person/personRoutes");
const productRoutes = require("./routes/Product/productRoutes")

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/person", personRoutes);
app.use("/products", productRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
