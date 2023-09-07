import Joi from "joi";

export const createCouponSchema = Joi.object({
  expiredAt: Joi.date().greater(Date.now()).required(),
  discount: Joi.number().min(1).max(100).required(),
}).required();

export const updateCouponSchema = Joi.object({
  expiredAt: Joi.date().greater(Date.now()),
  discount: Joi.number().min(1).max(100),
  code: Joi.string().required(),
}).required();
export const deleteSchema = Joi.object({
  code: Joi.string().required(),
}).required();
