import { WrapAsync } from "../utils/WrapAsync.js";
import { ExpressErr } from "../utils/ExpressErr.js";
import { User } from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/SendEmail.js";

const signUpController = WrapAsync(async (req, res) => {
  let { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!username || !email || !password) {
    throw new ExpressErr(400, "All fields are required!");
  } else if (existingUser) {
    throw new ExpressErr(409, "User already exist!");
  }

  let pfImage = !req.file
    ? "https://tse1.mm.bing.net/th/id/OIP.zSjnJGFe_TxQyoSX48_Z6wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
    : req.file.path;
  let salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const payLoad = {
    username,
    email,
    password: hashPassword,
    profileImg: pfImage,
  };

  // Post ki id user ke pas/ user ki id post ke pas
  const newUser = await User.create(payLoad);

  await sendEmail({
    to: email,
    text: "Thank's for signUp",
    subject: `Hi ${username} Welcome🎉to our website`,
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
