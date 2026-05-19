import cloud from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinary = cloud.v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "SocialMediaUploads",

    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export { cloudinary, storage };
