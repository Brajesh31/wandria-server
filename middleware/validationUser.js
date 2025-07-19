const {
  userValidationSchema,
  loginValidationSchema,
} = require("../utils/userValidation");

const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = { validateUser, validateLogin };
