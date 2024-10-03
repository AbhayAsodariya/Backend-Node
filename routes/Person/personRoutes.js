const express = require("express");
const {
  register,
  login,
  editUser,
  getUserData,
  deleteUser,
  jwtAuthMiddleware,
} = require("../../controllers/Person/Person-controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", jwtAuthMiddleware, getUserData); // Route to get logged-in user's data
router.put("/editUser/:id", jwtAuthMiddleware, editUser); // Protected route
router.delete("/deleteUser/:id", jwtAuthMiddleware, deleteUser); // Protected route

module.exports = router;
