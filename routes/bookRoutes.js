import express from "express";
import Book from "../models/book.js";

const router = express.Router();

/* CREATE */
router.post("/", async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const books = req.body.map(b => ({
        ...b,
        category: b.category?.toLowerCase(),
        price: b.link === "paid" ? b.price ?? 0 : 0,
      }));

      const saved = await Book.insertMany(books, { ordered: false });
      return res.status(201).json(saved);
    }

    const { title, img, category, content, link, price } = req.body;

    if (!title || !img || !category || !content || !link) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (link === "paid" && price == null) {
      return res.status(400).json({ error: "Price is required" });
    }

    const book = await Book.create({
      title,
      img,
      category: category.toLowerCase(),
      content,
      link,
      price: price || 0,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* READ */
router.get("/", async (_, res) => {
  res.json(await Book.find().lean());
});

router.get("/category/:category", async (req, res) => {
  res.json(
    await Book.find({
      category: req.params.category.toLowerCase(),
    }).lean()
  );
});

router.get("/title/:title", async (req, res) => {
  const title = decodeURIComponent(req.params.title).trim();
  const book = await Book.findOne({
    title: new RegExp(`^${title}$`, "i"),
  }).lean();

  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

router.get("/free", async (_, res) => {
  res.json(await Book.find({ link: "free" }).lean());
});

router.get("/paid", async (_, res) => {
  res.json(
    await Book.find({ link: "paid" })
      .select("title img category content link price")
      .lean()
  );
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  if (req.body.link === "paid" && req.body.price == null) {
    return res.status(400).json({ error: "Price required" });
  }

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).lean();

  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id).lean();
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json({ message: "Book deleted successfully" });
});

export default router;
