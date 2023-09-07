import userModel from "../../../../DB/models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { sendeMail } from "../../../utilies/email.js";
import {
  ConfirmEmailHtml,
  reConfirmEmailHtml,
  resetPasswordHtml,
} from "../../../utilies/generateHtml.js";
import asyncHandler from "../../../utilies/errorHandler.js";
import tokenModel from "../../../../DB/models/token.model.js";
import randomstring from "randomstring";
import cartModel from "../../../../DB/models/cart.model.js";
// import  CartModel  from "../../../../DB/models/cart.model.js";
export const signUp = asyncHandler(async (req, res, next) => {
  console.log("signup");
  const { userName, email, password } = req.body;
  const isUser = await userModel.findOne({ email });
  if (isUser) {
    return next(new Error("E-mail already registered "), { cause: 400 });
  }
  const hashPassword = bcrypt.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );
  const activationCode = crypto.randomBytes(64).toString("hex");
  const Link = `http://localhost:5000/auth/confirmEmail/${activationCode}`;
  const newLink = `http://localhost:5000/auth/newconfirmEmail/${activationCode}`;
  const newUser = await userModel.create({
    email,
    password: hashPassword,
    userName,
    activationCode,
  });
  //   const token = Jwt.sign({ email, _id: id }, process.env.TOKEN_SIGNATURE);
  const sentanEmail = await sendeMail({
    to: newUser.email,
    subject: "Please Confirm Your Email",
    html: ConfirmEmailHtml(Link, newLink),
  });

  return res.json({ message: "Done", newUser });
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { activationCode: req.params.activationCode },
    { confirmEmail: true, $unset: { activationCode: 1 } }
  );
  if (!user) {
    return res.json({ success: false, message: "User Not found" });
  }
  await cartModel.create({ user: user.id });
  return res.json({
    success: true,
    message: "Sucessfully confirmed back to login ",
  });
});
export const newConfirmationEmail = asyncHandler(async (req, res, next) => {
  const { activationCode } = req.params;
  const user = await userModel.findOne({ activationCode });
  if (!user || user.confirmEmail == true) {
    return res.json({ message: "Already Confirmed go to login!" });
  }
  const newLink = `http://localhost:5000/auth/confirmEmail/${activationCode}`;
  const sentanEmail = await sendeMail({
    to: user.email,
    subject: "reConfirmation e-mail",
    html: reConfirmEmailHtml(newLink),
  });
  //  awa if (!sentanEmail) {
  //     return next(new Error("Something Went Wrong!", { cause: 500 }));
  //   }
  return res.json({ message: "email resent succesfully ", user });
});
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const isUser = await userModel.findOne({ email });
  if (!isUser) {
    return next(new Error("Please Signup first!", { cause: 404 }));
  }
  if (isUser.confirmEmail == false) {
    return next(
      new Error("please confirm your email to continue", { cause: 500 })
    );
  }
  const match = bcrypt.compareSync(password, isUser.password);
  if (!match) {
    return next(new Error("Invalid Credintials!", { cause: 400 }));
  }
  const token = Jwt.sign(
    { email: isUser.email, id: isUser._id, userName: isUser.userName },
    process.env.TOKEN_SIGNATURE,
    { expiresIn: "2d" }
  );
  await tokenModel.create({
    token,
    user: isUser._id,
    agent: req.headers["user-agent"],
  });
  return res.json({ success: true, token, message: "Login Succesfully" });
});
// Send Forget Code by Email
export const forgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // Check User
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Email Not found", { cause: 404 }));
  }
  // Generate Code to send by email
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  user.forgetCode = code;
  // Save Code in DB
  await user.save();
  // Send an Email with the code
  return (await sendeMail({
    to: user.email,
    subject: "Reset Password",
    html: resetPasswordHtml(code),
  }))
    ? // check email was sent
      res.json({ message: " Check Your Email ! ", success: true })
    : next(new Error("Something went wrong !", { cause: 500 }));
});
// reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { code, password, cPassword } = req.body;
  const user = await userModel.findOne({ forgetCode: code });
  // Check User
  if (!user) {
    return next(new Error("Code is Wrong", { cause: 404 }));
  }
  // Hashing new password
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  user.password = hashPassword;

  // TO logout from all devices
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  // Save password in DB
  return (await user.save()) // check results
    ? res.json({ success: true, message: "Password Changed Succesfully " })
    : next(new Error("Something Went Wrong!", { cause: 500 }));
});
