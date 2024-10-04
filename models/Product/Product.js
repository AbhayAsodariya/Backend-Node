const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String
});

// Option Schema
const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

// SKU Schema
const skuSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  category: categorySchema,
  options: [optionSchema]
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
  sku: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  category: categorySchema,
  availableOptions: [{
    name: String,
    values: [String]
  }]
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
  SKU: mongoose.model("SKU", skuSchema),
  Category: mongoose.model("Category", categorySchema)
};
