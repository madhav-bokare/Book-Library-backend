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

/* ===== CORS (VERCEL SAFE) ===== */
const allowedOrigins = [
  "https://book-library-zoty.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/* ===== IMPORTANT: PREFLIGHT FIX ===== */
app.options("*", cors());

/* ===== ROUTES ===== */
app.use("/api/book", router);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.status(200).send("API is running ");
});

/* ===== SERVER START ===== */
const PORT = process.env.LOGIN_PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
};

startServer();
