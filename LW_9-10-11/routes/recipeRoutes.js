const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const restrictTo = require("../middleware/restrictTo");
const {
  getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe,
} = require("../controllers/recipeController");

// Публічні
router.get("/", getAllRecipes);
router.get("/:id", getRecipe);

// Тільки авторизовані
router.post("/", protect, createRecipe);
router.put("/:id", protect, updateRecipe);

// Тільки admin
router.delete("/:id", protect, restrictTo("admin"), deleteRecipe);

module.exports = router;