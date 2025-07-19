const express = require("express");
const {
  getAllBookings,
  addBooking,
  getBookingById,
  updateBook,
  deleteBook,
} = require("../controller/booking.controller");
const bookingRouter = express.Router();
const validateBooking = require("../middleware/validationBooking");
const protected = require("../middleware/protectedRoutes");
const authorization = require("../middleware/auth");

bookingRouter
  .route("/")
  .get(authorization, protected, getAllBookings)
  .post(authorization, validateBooking, addBooking);

bookingRouter.use(authorization, protected);
bookingRouter
  .route("/:id")
  .get(getBookingById)
  .put(validateBooking, updateBook)
  .delete(deleteBook);

module.exports = bookingRouter;
