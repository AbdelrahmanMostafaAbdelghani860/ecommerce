import Joi from "joi";

export const signUpValidation = Joi.object({
  phone: Joi.string()
    .pattern(new RegExp(/^01[0-2]\d{8}$/))
    .required(),
  password: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9]{8,}$/))
    .required(),
  userName: Joi.string().min(3).max(25).required(),
  email: Joi.string().email().required(),
  gender: Joi.string(),
  cPassword: Joi.string().valid(Joi.ref("password")).required(),
  age: Joi.number(),
}).required();
export const loginValidation = Joi.object({
  password: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9]{8,}$/))
    .required(),

  email: Joi.string().email().required(),
});
export const confimValidation = Joi.object({
  activationCode: Joi.string().required(),
}).required();
export const forgetCode = Joi.object({
  email: Joi.string().email().required(),
}).required();
export const resetPassword = Joi.object({
  code: Joi.string().max(5).required(),
  password: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9]{8,}$/))
    .required(),
  cPassword: Joi.string().valid(Joi.ref("password")).required(),
}).required();
