import Joi from 'joi';

export const signUpValidationSchema = Joi.object({
  firstName: Joi.string().label('First Name').required(),
  lastName: Joi.string().label('Last Name').required(),
  email: Joi.string().label('Email').required(),
  password: Joi.string().label('Password').required(),
}).options({
  abortEarly: false,
});

export const loginSchema = Joi.object({
  email: Joi.string().label('Email').required(),
  password: Joi.string().label('Password').required(),
}).options({
  abortEarly: false,
});
