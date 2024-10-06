const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Option Schema
const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  values: [{
    type: String,
    required: true
  }]
});

// SKU Schema
const skuSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    // unique: true, // Remove or comment this line
    default: () => uuidv4()
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  optionValues: {
    type: Map,
    of: String
  }
});


// Product Schema
const productSchema = new mongoose.Schema({
  name: {
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
  imgUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  skus: [skuSchema]
});

// AddToCart Schema
const addToCartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true
  },
  items: [addToCartSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
const AddToCart = mongoose.model('AddToCart', addToCartSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Product,
  AddToCart,
  Order
};