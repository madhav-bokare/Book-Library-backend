import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

/* BODY PARSER */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* CORS (ALLOW FRONTEND) */
app.use(
  cors({
    origin: "*",   // 🔥 TEMPORARY – testing के लिए
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* ROUTES */
app.use("/api/book", bookRoutes);

/* HEALTH */
app.get("/", (req, res) => {
  res.send("API running");
});

/* DB CONNECT (SAFE) */
connectDB();

export default app;
