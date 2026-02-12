import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/connect.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*", // 🔥 TESTING के लिए (CORS NOT ISSUE)
  })
);

app.use("/api/book", bookRoutes);

app.get("/", (_, res) => {
  res.send("API OK");
});

/* VERY IMPORTANT */
await connectDB();

export default app;
