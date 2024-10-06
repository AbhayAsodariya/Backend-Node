const express = require("express");
const {
  createAddToCart,
  getProductById,
  editProduct,
  deleteProduct,
  createGlobalProduct,
  getGlobalProducts,
  createSKU,
  getSKUsForProduct,
  getAvailableProducts,
  createOrder
} = require("../../controllers/Product/Product-controller");
const { jwtAuthMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

<<<<<<< Updated upstream
// SKU Routes
router.post("/:sku", createSKU);  // Route to create a SKU
router.put("/sku/:id", jwtAuthMiddleware, editSKU);  // Route to edit SKU

// Existing product routes
router.post("/profile/:id", jwtAuthMiddleware, createAddToCart);
router.post("/", createGlobleProduct);
=======
router.post("/", createGlobalProduct);
>>>>>>> Stashed changes
router.get("/", getGlobalProducts);
router.get("/available", getAvailableProducts);
router.get("/:id", getProductById);
router.post("/:id", editProduct);
router.delete("/:id", deleteProduct);
router.post("/sku", createSKU);
router.get("/:productId/skus", getSKUsForProduct);

// Protected routes
router.post("/addtocart/:id", jwtAuthMiddleware, createAddToCart);
router.post("/order", jwtAuthMiddleware, createOrder);

module.exports = router;