const express = require("express");
const authRouter = express.Router();
const { register, login, imageKitAuth ,logout} = require("../controller/auth.controller");
const { validateUser, validateLogin } = require("../middleware/validationUser");
const authorization = require("../middleware/auth");

authRouter.route("/sign-in").post(validateUser, register);
authRouter.route("/login").post(validateLogin, login);
authRouter.route("/logout").post(authorization, logout);

// ImageKit Generating Authentication Parameters
authRouter.route("/image-kit").get(imageKitAuth)

module.exports = authRouter;
