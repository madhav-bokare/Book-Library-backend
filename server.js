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

/* CORS */
app.use(
  cors({
    origin: "https://book-library-zoty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* ROUTES */
app.use("/api/book", bookRoutes);

app.get("/", (_, res) => {
  res.send("API running");
});

/* 🔥 SERVERLESS HANDLER */
let ready = false;
export default async function handler(req, res) {
  if (!ready) {
    await connectDB();
    ready = true;
  }
  return app(req, res);
}
