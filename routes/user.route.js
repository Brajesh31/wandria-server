const express = require("express");
const {
  getAllUsers,
  addUser,
  getUserById,
  updateUserData,
  deleteUser,
} = require("../controller/user.controller");
const {validateUser} = require("../middleware/validationUser");
const userRouter = express.Router();
const protected = require("../middleware/protectedRoutes");
const authorization = require("../middleware/auth");


userRouter
  .route("/")
  .get(authorization, protected, getAllUsers)
  .post(validateUser, authorization, protected, addUser);

userRouter
  .route("/:id")
  .get(authorization, protected, getUserById)
  .patch(authorization, protected, updateUserData)
  .delete(authorization, protected, deleteUser);

module.exports = userRouter;
