import Joi from "joi";
import { Types } from "mongoose";
const isvalidObject = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("Invalid ObjectID");
  }
};
export const brandValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  createdBy: Joi.string().custom(isvalidObject),
}).required();
export const updatebrand = Joi.object({
  name: Joi.string().min(3).max(20),
  brandid: Joi.string().custom(isvalidObject),
}).required();
export const deletebrand = Joi.object({
  brandid: Joi.string().custom(isvalidObject),
}).required();
