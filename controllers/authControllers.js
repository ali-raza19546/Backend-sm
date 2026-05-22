import { WrapAsync } from "../utils/WrapAsync.js";
import { ExpressErr } from "../utils/ExpressErr.js";
import { User } from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/SendEmail.js";
import { cloudinary } from "../Cloudinary.js";

const signUpController = WrapAsync(async (req, res) => {
  let { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!username || !email || !password) {
    throw new ExpressErr(400, "All fields are required!");
  } else if (existingUser) {
    throw new ExpressErr(409, "User already exist!");
  }

  if (!req.file) {
    throw new ExpressErr(400, "Profile image is required");
  }

  // upload image to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "profileImages",
  });

  let salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const payLoad = {
    username,
    email,
    password: hashPassword,
    profileImg: result.secure_url,
  };

  // Post ki id user ke pas/ user ki id post ke pas
  const newUser = await User.create(payLoad);

  await sendEmail({
    to: email,
    subject: `Welcome ${username} 🎉`,
    html: ` <div style="max-width:600px; margin:auto; padding:30px; background:#f5f5f5; border-radius:10px; font-family:Arial;">
     <h1 style="color:#4f46e5;"> Welcome, {{username}} 🎉 </h1> 
     <p style="font-size:16px; color:#333;"> Your account has been successfully created. Now you can connect with people and enjoy all features of our platform. </p>
      <ul style="line-height:30px; color:#444;"> 
      <li>📸 Share Posts</li> <li>❤️ Like Posts</li>
       <li>💬 Add Comments</li> 
       <li>👥 Follow Friends</li>
        <li>🔔 Get Notifications</li>
         <li>🌍 Explore Trending Content</li> 
         </ul> 
         <h3 style="margin-top:30px; color:#111;"> We are excited to have you in our community 🚀 </h3> </div>`,
  });

  res.status(200).json({
    message: "User created successfully",
    success: true,
    data: newUser,
  });
});

// Login Controller
const LoignController = WrapAsync(async (req, res) => {
  let { username, password } = req.body;
  const isUser = await User.findOne({ username });
  if (!isUser) {
    throw new ExpressErr(404, "User not Found!");
  }
  const isMatch = await bcrypt.compare(password, isUser.password);
  if (!isMatch) {
    throw new ExpressErr(401, "Please enter valid data!");
  }

  const payLoad = {
    id: isUser._id,
  };

  const token = await jwt.sign(payLoad, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res
    .cookie("token", token)
    .status(200)
    .json({
      message: "Login Successfull",
      success: true,
      token,
      user: {
        id: isUser._id,
        username: isUser.username,
      },
    });
});

export { signUpController, LoignController };
