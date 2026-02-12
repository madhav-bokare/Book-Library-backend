import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

/* CORS */
app.use(
  cors({
    origin: "https://book-library-zoty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* MongoDB connect per request  */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

/* Routes */
app.use("/api/book", bookRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "Backend OK" });
});

export default app;
