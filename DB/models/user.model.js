import { Schema, model } from "mongoose";
// Schema for the user
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmEmail: { type: Boolean, default: false },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: String,
    status: {
      type: String,
      default: "offline",
      enum: ["online", "offline"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    forgetCode: String,
    activationCode: String,
  },
  { timestamps: true }
);
//  Model

const userModel = model("user", userSchema);
export default userModel;
