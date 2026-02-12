import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://book-library-zoty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//  DB connect ONCE
connectDB();

app.use("/api/book", bookRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend OK" });
});

export default app;
