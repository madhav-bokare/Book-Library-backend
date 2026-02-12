import express from "express";
import Book from "../models/book.js";

const router = express.Router();

// ===== POST: Add single or multiple books =====
router.post("/", async (req, res) => {
  try {
    // Multiple books
    if (Array.isArray(req.body)) {
      const books = req.body.map(b => ({
        ...b,
        category: b.category?.toLowerCase(),
        link: b.link,
        price: b.link === "paid" ? b.price ?? 0 : 0,
      }));

      const savedBooks = await Book.insertMany(books);
      return res.status(201).json(savedBooks);
    }

    // Single book
    const { title, img, category, content, link, price } = req.body;

    if (!title || !img || !category || !content || !link) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (link === "paid" && (price === undefined || price === null)) {
      return res.status(400).json({ error: "Price is required for paid books" });
    }

    const newBook = await Book.create({
      title,
      img,
      category: category.toLowerCase(),
      content,
      link,
      price: price || 0,
    });

    res.status(201).json(newBook);
  } catch (err) {
    console.error("CREATE Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: All Books (FAST) =====
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().lean();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: By Category (FAST) =====
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const books = await Book.find({ category }).lean();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: By Title (FAST & SAFE) =====
router.get("/title/:title", async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title).trim();

    const book = await Book.findOne({
      title: new RegExp(`^${title}$`, "i"),
    }).lean();

    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: Free Books (FAST) =====
router.get("/free", async (req, res) => {
  try {
    const books = await Book.find({ link: "free" }).lean();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GET: Paid Books (FAST) =====
router.get("/paid", async (req, res) => {
  try {
    const books = await Book.find({ link: "paid" })
      .select("title img category content link price")
      .lean();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== PUT: Update Book =====
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (
      updateData.link === "paid" &&
      (updateData.price === undefined || updateData.price === null)
    ) {
      return res.status(400).json({ error: "Price is required for paid books" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).lean();

    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== DELETE: Remove Book =====
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id).lean();
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
