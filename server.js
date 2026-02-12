import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

/* ===== BODY PARSER ===== */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===== CORS ===== */
app.use(
  cors({
    origin: "https://book-library-zoty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* ===== ROUTES ===== */
app.use("/api/book", bookRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

/* ===== DB CONNECT ===== */
connectDB();

export default app;
