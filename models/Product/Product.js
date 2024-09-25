const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import the uuid function

// Sub-schema for Size
const sizeSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// Sub-schema for Color
const colorSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// Variant Schema
const variantSchema = new mongoose.Schema({
  sizes: [sizeSchema],
  colors: [colorSchema],
});

// Base Product Schema
const baseProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  ImgUrl: {
    type: String,
    required: true,
  },
  variants: [variantSchema],
});

// Schema for Global Product
const productSchema = new mongoose.Schema({
  ...baseProductSchema.obj,
});

// Schema for Product Add to Cart with `createdBy` field
const productAddToCartSchema = new mongoose.Schema({
  ...baseProductSchema.obj,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
});

module.exports = {
  Product: mongoose.model("Product", productSchema),
  ProductAddToCart: mongoose.model("ProductAddToCart", productAddToCartSchema),
};
