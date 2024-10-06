const express = require("express");
const router = express.Router();
const {
  createGlobalProduct,
  getGlobalProducts,
  createAddToCart,
  editProduct,
  deleteProduct,
  getProductById,
  getProductOptions,
  createSKUFromOptions,
  getCartItems,
} = require("../../controllers/Product/Product");

// Route to create a new product
router.post("/", createGlobalProduct);

// Route to get all products
router.get("/", getGlobalProducts);

// Route to get a specific product by ID
router.get("/:id", getProductById);

// Route to edit a specific product
router.post("/:id/edit", editProduct);

// Route to delete a product
router.delete("/:id", deleteProduct);

// Route to get options of a product
router.get("/:productId/options", getProductOptions);

// Route to create or update SKU from options
router.post("/:productId/skus", createSKUFromOptions);

// Route to add a product to the cart
router.post("/:id/add-to-cart", createAddToCart);

// Route to get cart items for the logged-in user
router.get("/cart", getCartItems);


module.exports = router;
