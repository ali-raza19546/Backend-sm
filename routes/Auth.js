import express from "express";
import {
  LoignController,
  signUpController,
} from "../controllers/authControllers.js";
const route = express.Router();
import multer from "multer";
import { storage } from "../Cloudinary.js";

const upload = multer({ storage: storage });
route.post("/signup", upload.single("pfImage"), signUpController);
route.post("/login", LoignController);

export default route;
