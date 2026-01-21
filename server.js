import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js"; 
import router from "./routes/bookRoutes.js";



dotenv.config();
const app = express();

// ===== JSON & URL-encoded body size increase =====
app.use(express.json({ limit: "50mb" }));       
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ===== MongoDB Connect =====
connectDB()

// ===== Middleware =====
app.use(
  cors({
    origin: "https://book-library-zoty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===== Routes =====//
app.use("/api/book", router);

// ===== Server Start =====
app.listen(process.env.LOGIN_PORT ||5000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
