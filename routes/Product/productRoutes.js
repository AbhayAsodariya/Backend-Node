const express = require("express");
const {
  createAddToCart,
  getProductById,
  editProduct,
  deleteProduct,
  createGlobleProduct,
  getGlobalProducts,
  createSKU,  // New SKU creation controller
  editSKU,    // New SKU edit controller
} = require("../../controllers/Product/Product-controller");
const { jwtAuthMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

// SKU Routes
router.post("/:sku", createSKU);  // Route to create a SKU
router.put("/sku/:id", jwtAuthMiddleware, editSKU);  // Route to edit SKU

// Existing product routes
router.post("/profile/:id", jwtAuthMiddleware, createAddToCart);
router.post("/", createGlobleProduct);
router.get("/", getGlobalProducts);
router.get("/:id", getProductById);
router.post("/edit/:id",  editProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
