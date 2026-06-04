const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title must be at most 200 characters"],
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients are required"],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "At least one ingredient is required",
    },
  },
  steps: {
    type: [String],
    required: [true, "Steps are required"],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "At least one step is required",
    },
  },
  cookTime: {
    type: Number,
    required: [true, "Cook time is required"],
    min: [1, "Cook time must be at least 1 minute"],
  },
  cuisine: {
    type: String,
    required: [true, "Cuisine is required"],
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);