require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Note = require("./models/Note");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS — щоб у наступній лабі до сервера зміг звертатися фронтенд
app.use(cors());

// Парсер JSON
app.use(express.json());

// Базове логування запитів
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Підключення до MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection error:", err.message));

// GET /notes — усі замітки (новіші зверху)
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /notes — створити замітку
app.post("/notes", async (req, res) => {
  try {
    const { title, text } = req.body || {};
    if (!title || !text) {
      return res.status(400).json({ error: "title and text are required" });
    }
    const note = new Note({ title, text });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /notes/:id — одна замітка за ID
app.get("/notes/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /notes/:id — оновити title та/або text
app.put("/notes/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  try {
    const { title, text } = req.body || {};
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, text },
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /notes/:id — видалити замітку
app.delete("/notes/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid ObjectId" });
  }
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

