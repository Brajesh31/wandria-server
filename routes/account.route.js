const express = require("express");
const authorization = require("../middleware/auth");
const accountRouter = express.Router();
const getAccount = require("../controller/account.controller")

accountRouter.route("/").get(getAccount);

module.exports = accountRouter;
