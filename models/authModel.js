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
      require: true,
    },
    password: String,
  },

  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
