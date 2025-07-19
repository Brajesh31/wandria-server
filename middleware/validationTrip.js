const tripValidationSchema = require("../utils/tripValidation");

const validateTrip = (req, res, next) => {
  const { error } = tripValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = validateTrip;
