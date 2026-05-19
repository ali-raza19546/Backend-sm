import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDb from "./DB/db.js";
import cookie from "cookie-parser";
import authRoute from "./routes/Auth.js";
import postRoute from "./routes/Posts.js";
import path from "path";
import multer from "multer";
import { ExpressErr } from "./utils/ExpressErr.js";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/uploads", express.static("upload"));
app.use(cookie());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Auth Route
app.use("/api", authRoute);
// Posts Route
app.use("/post", postRoute);

app.use((req, res, next) => {
  res.status(404).json({
    message: "PAGE NOT FOUND!",
  });
});

// Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  // Multer Error
  if (err instanceof multer.MulterError) {
    err = new ExpressErr(err.message, 400);
  }
  console.log(statusCode, message);
  res.status(statusCode).json({
    message,
    success: false,
  });
});

const PORT = process.env.PORT || 5000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
