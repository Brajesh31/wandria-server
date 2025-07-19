const Joi = require("joi");

const bookingValidationSchema = Joi.object({
  user_id: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid user ID format"),

  trip_id: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid trip ID format"),

  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .default("pending"),


  // number_of_seats: Joi.number().integer().min(1).required().messages({
  //   "number.base": "Number of seats must be a number",
  //   "number.min": "At least 1 seat must be booked",
  //   "any.required": "Number of seats is required",
  // }),
});

module.exports = bookingValidationSchema;
