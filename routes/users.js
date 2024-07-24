const express = require("express");
const {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  addUser // Import the addUser function from the userController
} = require("../controllers/userController");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// GET all users
router.get("/", verifyTokenAndAdmin, getAllUsers);

// GET, PUT, DELETE user by ID
router
  .route("/:id")
  .put(verifyTokenAndAdmin, updateUser)
  .get(verifyTokenAndAuthorization, getUserById)
  .delete(verifyTokenAndAdmin, deleteUser);

// POST Add User
router.post("/", verifyTokenAndAdmin, addUser);

module.exports = router;
