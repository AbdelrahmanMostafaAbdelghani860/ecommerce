import asyncHandler from "../utilies/errorHandler.js";

const isAuthorized = (role) => {
  return asyncHandler((req, res, next) => {
    if (role !== req.user.role) {
      return next(
        new Error("You are not allowed in this satge ", { cause: 403 })
      );
    }
    return next();
  });
};
export default isAuthorized;
