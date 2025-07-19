const express = require("express");
const refresh = require("../controller/refreshToken.controller");
const refreshRoute = express.Router();

refreshRoute.route("/").get(refresh);

module.exports = refreshRoute;
