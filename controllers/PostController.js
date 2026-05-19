import { WrapAsync } from "../utils/WrapAsync.js";
import { ExpressErr } from "../utils/ExpressErr.js";
import { PostModel } from "../models/postModel.js";

// get all Post
const getPosts = WrapAsync(async (req, res) => {
  const allPosts = await PostModel.find({}).populate(
    "user",
    "username profileImg",
  );
  if (!allPosts) {
    throw new ExpressErr(404, "Post Not Found!");
  }
  res.status(200).json(allPosts);
});

// Post Add
const addPost = WrapAsync(async (req, res) => {
  let { title, content, tags } = req.body;
  if (!title || !content || !tags) {
    throw new ExpressErr(400, "please Fill all fileds!");
  }

  let payLoad = {
    title,
    content,
    tags,
    user: req.user.id,
    image: req.file.path,
  };

  let newPost = await PostModel.create(payLoad);
  res.status(201).json({
    message: "Post created Successful",
    newPost,
    success: true,
  });
});

// deletePost
// Post ki id lie jaiey ge,
// ager id na miley to err,
// ager id mil gi to db mein check
// ager db mein na mili to err,
// ager mill gi to only owner delete,
// owner recive req,

const distroyPost = WrapAsync(async (req, res) => {
  let { id } = req.params;
  if (!id) {
    throw new ExpressErr(400, "Id required!");
  }
  const postId = await PostModel.findById(id);
  if (!postId) {
    throw new ExpressErr(404, "Post Not Found!");
  }
  if (postId.user.toString() !== req.user.id) {
    throw new ExpressErr(403, "Only Owner can delete");
  }
  let deletedPost = await PostModel.findByIdAndDelete(id);
});

export { getPosts, addPost, distroyPost }; // yaha delete post aur updata post aur bhi sarey yahi aien ge
