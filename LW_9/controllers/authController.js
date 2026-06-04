const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Усі поля присутні
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2. Довжина пароля (перевіряємо ДО хешування — хеш завжди довгий)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // 3. Паролі збігаються
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // 4. Email ще не зайнятий
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 5. Хешування пароля (saltRounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Створення користувача
    const user = await User.create({ name, email, password: hashedPassword });

    // 7. Відповідь без пароля
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};