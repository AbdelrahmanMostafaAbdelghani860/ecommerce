import Joi from "joi";
import { Types } from "mongoose";
const isvalidObject = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("Invalid ObjectID");
  }
};
export const CategoryValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  createdBy: Joi.string().custom(isvalidObject),
}).required();
export const updateCategory = Joi.object({
  name: Joi.string().min(3).max(20),
  categoryid: Joi.string().custom(isvalidObject),
}).required();
export const deleteCategory = Joi.object({
  categoryid: Joi.string().custom(isvalidObject),
}).required();
