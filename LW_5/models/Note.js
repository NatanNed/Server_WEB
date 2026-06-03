const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Модель Note за замовчуванням працює з колекцією "notes"
module.exports = mongoose.model("Note", noteSchema);