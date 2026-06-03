const express = require("express");

const app = express();
const PORT = 3000;

// Парсер JSON для тіла запитів
app.use(express.json());

// Middleware логування (має бути ДО маршрутів)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Головний маршрут
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

/* ===================== Завдання 1: ресурс notes ===================== */
const notes = []; // in-memory "база"

// Отримання списку заміток
app.get("/notes", (req, res) => {
  res.json(notes);
});

// Отримання однієї замітки за id
app.get("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = notes.find((n) => n.id === id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(note);
});

// Додавання нової замітки
app.post("/notes", (req, res) => {
  const { id, text } = req.body || {};

  // Валідація формату
  if (typeof id !== "number" || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid note format" });
  }

  // Перевірка унікальності id
  if (notes.some((n) => n.id === id)) {
    return res.status(409).json({ error: "Note with this id already exists" });
  }

  const note = { id, text };
  notes.push(note);
  res.status(201).json(note);
});

// Оновлення замітки (PUT — повне оновлення; id беремо з URL)
app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { text } = req.body || {};

  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  if (typeof text !== "string") {
    return res.status(400).json({ error: "Invalid note format" });
  }

  const updatedNote = { id, text }; // id з URL, щоб не змінювався
  notes[idx] = updatedNote;
  res.json(updatedNote);
});

// Видалення замітки
app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  notes.splice(idx, 1);
  res.status(204).send(); // No Content
});

/* ===================== Завдання 2: ресурс items ===================== */
const items = [
  { id: 1, name: "Товар 1", price: 100 },
  { id: 2, name: "Товар 2", price: 200 },
];

// Усі товари
app.get("/items", (req, res) => {
  res.json(items);
});

// Один товар за id (Додаткове завдання: 404 якщо не знайдено)
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.json(item);
});

// Додавання товару
app.post("/items", (req, res) => {
  const { id, name, price } = req.body || {};

  if (typeof id !== "number" || typeof name !== "string" || typeof price !== "number") {
    return res.status(400).json({ error: "Invalid item format" });
  }
  if (items.some((i) => i.id === id)) {
    return res.status(409).json({ error: "Item with this id already exists" });
  }

  const item = { id, name, price };
  items.push(item);
  res.status(201).json(item);
});

// Оновлення товару (PUT)
app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, price } = req.body || {};

  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  if (typeof name !== "string" || typeof price !== "number") {
    return res.status(400).json({ error: "Invalid item format" });
  }

  const updatedItem = { id, name, price };
  items[idx] = updatedItem;
  res.json(updatedItem);
});

// Видалення товару
app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  items.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});