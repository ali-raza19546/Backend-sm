import mongoose, { SchemaType } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: String,
    postId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profileImg: {
      type: String,
      default:
        "https://tse1.mm.bing.net/th/id/OIP.zSjnJGFe_TxQyoSX48_Z6wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      required: true,
    },
    password: String,
  },

  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
