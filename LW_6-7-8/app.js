require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const ApiError = require("./errors/ApiError");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
connectDB();

app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API для роботи з постами та коментарями",
    endpoints: { posts: "/api/posts", comments: "/api/comments" },
  });
});

// Тимчасовий маршрут для перевірки обробки 500 (видалити після тесту)
app.get("/api/error-test", (req, res) => {
  throw new Error("Навмисна помилка для перевірки errorHandler");
});

// 404 — маршрут не знайдено (після всіх роутів)
app.use((req, res, next) => {
  next(ApiError.notFound("Маршрут не знайдено"));
});

// Централізована обробка помилок (обов'язково останній)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));