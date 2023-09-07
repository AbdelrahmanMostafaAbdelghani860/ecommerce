import tokenModel from "../../DB/models/token.model.js";
import userModel from "../../DB/models/user.model.js";
import asyncHandler from "../utilies/errorHandler.js";
import Jwt from "jsonwebtoken";
const isAuthinticated = asyncHandler(async (req, res, next) => {
  // Get the token from authorization
  const { token } = req.headers;
  if (!token) {
    return next(new Error("Not avaliable token", { cause: 404 }));
  }

  const decoded = Jwt.verify(token, process.env.TOKEN_SIGNATURE);
  // check token in DB
  const userToken = await tokenModel.findOne({ token });
  if (!userToken) {
    return next(new Error("Invalid token"));
  }
  // check if the token is in-valid
  if (userToken.isValid == false) {
    return next(new Error("Not valid token ", { cause: 400 }));
  }
  // find if user exist
  const user = await userModel.findOne({ email: decoded.email });
  // console.log(user);
  if (!user) {
    return next(new Error("User is missed", { cause: 404 }));
  }
  // pass the user
  req.user = user;
  // console.log(req.user._id);

  return next();
});
export default isAuthinticated;
