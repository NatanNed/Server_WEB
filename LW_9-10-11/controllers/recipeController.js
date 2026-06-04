const Recipe = require("../models/Recipe");
const AppError = require("../utils/AppError");

// GET /api/recipes — усі рецепти (публічний)
exports.getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, count: recipes.length, data: recipes });
  } catch (err) {
    next(err);
  }
};

// GET /api/recipes/:id — один рецепт (публічний)
exports.getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "name");
    if (!recipe) return next(new AppError("Рецепт не знайдено", 404));
    res.status(200).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

// POST /api/recipes — створити (тільки авторизований)
exports.createRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

// PUT /api/recipes/:id — оновити (тільки авторизований)
exports.updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) return next(new AppError("Рецепт не знайдено", 404));
    res.status(200).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/recipes/:id — видалити (тільки admin)
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return next(new AppError("Рецепт не знайдено", 404));
    res.status(200).json({ success: true, message: "Рецепт видалено" });
  } catch (err) {
    next(err);
  }
};