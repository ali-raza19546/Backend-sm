// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import { ExpressErr } from "./utils/ExpressErr.js";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = "upload/";
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new ExpressErr(400, "only image file are allowed!"));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });
// console.log(upload);

// export default upload;
