const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db"); // Import the MongoDB connection
require("dotenv").config();

const app = express();

// CORS configuration (uncomment and modify if specific CORS options are needed)
// const corsOptions = {
//   origin: "http://localhost:3000", // Replace with your React app's URL
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Enable if you need to include cookies in the requests
//   optionsSuccessStatus: 204,
// };

// Use CORS middleware
app.use(cors());

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000; 

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Import routes
const personRoutes = require("./routes/personRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");

// Use imported routes
app.use("/person", personRoutes);
app.use("/menu", menuItemRoutes);


// Start the server
app.listen(PORT, () => console.log("Server started on port 5000..."));
