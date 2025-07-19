const express = require("express");
const getLatestData = require("../controller/dashboard.controller");
const dashRouter = express.Router();
const protected = require("../middleware/protectedRoutes");
const authorization = require("../middleware/auth");

dashRouter.use(authorization, protected);
dashRouter.route("/").get(getLatestData);

module.exports = dashRouter;
