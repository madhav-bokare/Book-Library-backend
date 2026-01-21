import express from "express";
import Book from "../models/book.js";

const router = express.Router();

// ===== POST: Add single or multiple books =====
router.post("/", async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const books = req.body.map(b => ({
        ...b,
        category: b.category?.toLowerCase(),
        link: b.link,
        price: b.price || 0, // price default 0 agar nahi diya
      }));

      const savedBooks = await Book.insertMany(books);
      return res.status(201).json(savedBooks);
    }

    const { title, img, category, content, link, price } = req.body;

    if (!title || !content || !category || !img || !link) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Paid books ke liye price check karo
    if (link === "paid" && (price === undefined || price === null)) {
      return res.status(400).json({ error: "Price is required for paid books" });
    }

    const newBook = await Book.create({
      title,
      img,
      category: category.toLowerCase(),
      content,
      link,
      price: price || 0, // default 0
    });

    res.status(201).json(newBook);

  } catch (err) {
    console.error("CREATE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: All Books =====
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: By Category =====
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const books = await Book.find({ category });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: By Title =====
router.get("/title/:title", async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title).trim();

    const book = await Book.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
    });

    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: Free Books =====
router.get("/free", async (req, res) => {
  const books = await Book.find({ link: "free" });
  res.json(books);
});

// ===== GET: Paid Books (price included) =====
router.get("/paid", async (req, res) => {
  const books = await Book.find({ link: "paid" }).select("title img category content link price");
  res.json(books);
});

// ===== PUT: Update Book =====
router.put("/:id", async (req, res) => {
  try {
    // agar paid book hai to price update bhi allow karo
    const updateData = { ...req.body };
    if (updateData.link === "paid" && (updateData.price === undefined || updateData.price === null)) {
      return res.status(400).json({ error: "Price is required for paid books" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== DELETE: Remove Book =====
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
