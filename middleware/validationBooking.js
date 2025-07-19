const bookingValidationSchema = require("../utils/bookingValidation");

const validateBooking = (req, res, next) => {
  const { error } = bookingValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateBooking;
