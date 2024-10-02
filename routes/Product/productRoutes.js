const express = require("express");
const {
  createAddToCart,
  getProductById,
  editProduct,
  deleteProduct,
  createGlobleProduct,
  getGlobalProducts,
} = require("../../controllers/Product/Product-controller");
const { jwtAuthMiddleware } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/profile/:id", jwtAuthMiddleware, createAddToCart);
router.post("/", createGlobleProduct);
router.get("/", getGlobalProducts);
router.get("/:id", getProductById); // Get product by ID
router.post("/:id", jwtAuthMiddleware, editProduct); // Edit product using POST
router.delete("/:id", jwtAuthMiddleware, deleteProduct); // Delete product

module.exports = router;
