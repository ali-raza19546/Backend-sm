import express from "express";
import multer from "multer";
import {
  addPost,
  distroyPost,
  // distroyPost,
  getPosts,
} from "../controllers/PostController.js";
import { isToken } from "../middleware/tokenVerify.js";
import { ExpressErr } from "../utils/ExpressErr.js";
import { postLikes } from "../controllers/Likepost.js";
import { storage } from "../Cloudinary.js";
const route = express.Router();

const upload = multer({ storage: storage });

route.get("/allPosts", getPosts);
route.post("/addPost", isToken, upload.single("image"), addPost);
route.delete("/delete/:id", isToken, distroyPost);
route.post("/:postId/like", isToken, postLikes);

export default route;
