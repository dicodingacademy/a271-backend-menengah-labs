import Joi from 'joi';

export const userPayloadSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().required(),
});

export const userUpdatePayloadSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().min(6),
  fullname: Joi.string(),
}).min(1);
