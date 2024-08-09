const mongoose = require("mongoose");

// Define the schema for a menu item
const menuItemSchema = new mongoose.Schema({
  // Name of the menu item
  name: {
    type: String,
    required: true,
  },
  // Price of the menu item
  price: {
    type: Number,
    required: true,
  },
  // Taste category of the menu item
  taste: {
    type: String,
    enum: ["Sweet", "Spicy", "Sour"],
    required: true,
  },
  // Boolean to indicate if the item is a drink
  is_drink: {
    type: Boolean,
    default: false,
  },
  // Ingredients used in the menu item
  ingredients: {
    type: [String],
    default: [],
  },
  // Number of times the item has been sold
  num_sales: {
    type: Number,
    default: 0,
  },
});

// Create the model from the schema
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
