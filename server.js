import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js";
import router from "./routes/bookRoutes.js";

dotenv.config();
const app = express();

/* ===== BODY PARSER (OPTIMIZED) ===== */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

/* ===== CORS (FAST) ===== */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://book-library-zoty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ===== ROUTES ===== */
app.use("/api/book", router);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.status(200).send("API is running ");
});

/* ===== SERVER START AFTER DB CONNECT ===== */
const PORT = process.env.LOGIN_PORT || 5000;

const startServer = async () => {
  await connectDB(); 
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
};

startServer();
