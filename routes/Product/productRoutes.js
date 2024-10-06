const express = require("express");
const {
  createAddToCart,
  getProductById,
  editProduct,
  deleteProduct,
  createGlobalProduct,
  getGlobalProducts,
  getProductOptions,
  createSKUFromOptions,
  getSKUsForProduct,
  getAvailableProducts,
  createOrder
} = require("../../controllers/Product/Product-controller");
const { jwtAuthMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", createGlobalProduct);
router.get("/", getGlobalProducts);
router.get("/available", getAvailableProducts);
router.get("/:id", getProductById);
router.post("/:id", editProduct);
router.delete("/:id", deleteProduct);
router.get("/:productId/options", getProductOptions);
router.post("/:productId/sku-from-options", createSKUFromOptions);
router.get("/:productId/skus", getSKUsForProduct);

// Protected routes
router.post("/addtocart/:id", jwtAuthMiddleware, createAddToCart);
router.post("/order", jwtAuthMiddleware, createOrder);

module.exports = router;