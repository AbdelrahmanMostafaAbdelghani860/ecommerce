import Joi from "joi";
import { Types } from "mongoose";
const isvalidObject = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("Invalid ObjectID");
  }
};
export const CartSchema = Joi.object({
  productId: Joi.string().custom(isvalidObject).required(),
  quantity: Joi.number().min(1).integer().required(),
}).required();
export const removeProduct = Joi.object({
  productId: Joi.string().custom(isvalidObject).required(),
}).required();
