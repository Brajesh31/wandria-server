const Joi = require("joi");

const tripValidationSchema = Joi.object({
  country: Joi.string().trim().required(),

  duration: Joi.string().trim().required(),

  interest: Joi.string().required(),

  style: Joi.string().required(),

  groupType: Joi.string()
    .valid("Solo", "Couple", "Family", "Friends", "Business")
    .required(),
});

module.exports = tripValidationSchema;
