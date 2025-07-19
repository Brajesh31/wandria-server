const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "name is required" }),

  email: Joi.string()
    .email()
    .min(5)
    .required()
    .messages({ "any.required": "email is required" }),

  password: Joi.string()
    .min(5)
    .required()
    .messages({ "any.required": "password is required" }),

  image: Joi.string().optional(),

  birth_day: Joi.date()
    .iso()
    .required()
    .messages({ "any.required": "birth day is required" }),

  role: Joi.string().valid("admin", "user").default("user"),
});

const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .min(5)
    .required()
    .messages({ "any.required": "email is required" }),

  password: Joi.string()
    .min(5)
    .required()
    .messages({ "any.required": "password is required" }),
});

module.exports = { userValidationSchema, loginValidationSchema };
