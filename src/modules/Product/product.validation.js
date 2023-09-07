import Joi from "joi";
import { Types } from "mongoose";
const isvalidObject = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("Invalid ObjectID");
  }
};

export const createProduct = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  description: Joi.string().min(5),

  avaliableItems: Joi.number().min(1).required(),

  discount: Joi.number().min(1),

  price: Joi.number().required(),

  createdBy: Joi.string().custom(isvalidObject),

  category: Joi.string().custom(isvalidObject),

  subCategory: Joi.string().custom(isvalidObject),
}).required();
export const productidSchema = Joi.object({
  productId: Joi.string().custom(isvalidObject).required(),
}).required();
export const categoryidSchema = Joi.object({
  categoryId: Joi.string().custom(isvalidObject).required(),
  sort: Joi.string(),
  page: Joi.string(),
}).required();
