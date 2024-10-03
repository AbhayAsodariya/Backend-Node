const express = require("express");
const {
  register,
  login,
  editUser,
  deleteUser,
  jwtAuthMiddleware,
  getUserById,
} = require("../../controllers/Person/Person-controller");
const router = express.Router();

router.post("/register", register);
router.get("/:id", getUserById);
router.post("/login", login);
router.put("/editUser/:id", jwtAuthMiddleware, editUser); // Protected route
router.delete("/deleteUser/:id", jwtAuthMiddleware, deleteUser); // Protected route

module.exports = router;
