import Joi from "joi";
import { Types } from "mongoose";
const isvalidObject = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("Invalid ObjectID");
  }
};
export const createOrderSchema = Joi.object({
  Payment: Joi.string().valid("cash", "visa").required(),
  address: Joi.string().min(10).required(),
  phone: Joi.string()
    .pattern(new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/))
    .required(),
  coupon: Joi.string().length(6),
}).required();
export const deleteOrderSchema = Joi.object({
  orderId: Joi.string().custom(isvalidObject).required(),
}).required();
