import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../MongoDB/connect.js";
import bookRoutes from "../routes/bookRoutes.js";

dotenv.config();

const app = express();

/* BODY */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 🔥 CORS — IMPORTANT */
app.use(
  cors({
    origin: "https://book-library-zoty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

/* 🔥 PRE-FLIGHT FIX */
app.options("*", cors());

/* ROUTES */
app.use("/api/book", bookRoutes);

app.get("/", (_, res) => {
  res.send("API running");
});

/* 🔥 SERVERLESS HANDLER */
let isReady = false;

export default async function handler(req, res) {
  try {
    if (!isReady) {
      await connectDB();
      isReady = true;
    }
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server crashed" });
  }
}
