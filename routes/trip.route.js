const express = require("express");
const validateTrip = require("../middleware/validationTrip");
const tripRouter = express.Router();
const {
  getAllTrips,
  addTrip,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controller/trip.controller");
const protected = require("../middleware/protectedRoutes");
const authorization = require("../middleware/auth");

tripRouter
  .route("/")
  .get(getAllTrips)
  .post(authorization, protected, validateTrip, addTrip);

tripRouter
  .route("/:id")
  .get(authorization, getTripById)
  .patch(authorization, protected, updateTrip)
  .delete(authorization, protected, deleteTrip);

module.exports = tripRouter;
