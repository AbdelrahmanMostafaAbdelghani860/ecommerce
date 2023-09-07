import Joi from "joi";
import { Types } from "mongoose";

const isValidObject = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("invalid objectId");
  }
};
export const createSubCategory = Joi.object({
  name: Joi.string().max(25).min(5).required(),
  categoryId: Joi.string().custom(isValidObject).required(),
}).required();
export const updateCategory = Joi.object({
  name: Joi.string().max(25).min(5).required(),
  categoryId: Joi.string().custom(isValidObject).required(),
  subcategoryid: Joi.string().custom(isValidObject).required(),
}).required();
