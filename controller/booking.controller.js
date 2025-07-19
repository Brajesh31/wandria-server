const asyncWrapper = require("../middleware/asyncWrapper");
const Booking = require("../model/booking.model");
const dataform = require("../utils/dataForm");

const getAllBookings = asyncWrapper(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user_id", "first_name last_name email image")
    .populate("trip_id", "title price seats duration location country").limit(15);

  if (bookings.length === 0) {
    return res.status(404).json(dataform("faild", 404, "no bookings found"));
  }
  return res
    .status(200)
    .json(dataform("success", 200, "successfully operation", bookings));
});

const addBooking = asyncWrapper(async (req, res) => {
  const { user_id, trip_id } = req.body;
  const existingBooking = await Booking.findOne({ user_id, trip_id });
  if (existingBooking) {
    return res
      .status(400)
      .json(dataform("faild", 400, "You already booked this trip."));
  }

  const newBook = await Booking.create(req.body);
  if (!newBook) {
    return res
      .status(400)
      .json(dataform("faild", 400, "falid operation ,try again"));
  }
  return res
    .status(201)
    .json(dataform("success", 200, "booking added successfully", newBook));
});

const getBookingById = asyncWrapper(async (req, res) => {
  const target = await Booking.findById(req.params.id)
    .populate("user_id", "first_name last_name email image")
    .populate("trip_id", "title price seats duration location country");

  if (!target)
    return res.status(404).json(dataform("faild", 404, "invalid booking id"));

  return res
    .status(200)
    .json(dataform("success", 200, "successfully operation", target));
});

const updateBook = asyncWrapper(async (req, res) => {
  const bookingData = await Booking.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });
  if (!bookingData)
    return res.status(404).json(dataform("faild", 404, "invalid bokking data"));

  return res
    .status(201)
    .json(
      dataform("success", 201, "booking updated successfully", bookingData)
    );
});

const deleteBook = asyncWrapper(async (req, res) => {
  const delbooking = await Booking.deleteOne({ _id: req.params.id });

  return res
    .status(201)
    .json(dataform("success", 201, "booking deleted successfully"));
});

module.exports = {
  getAllBookings,
  addBooking,
  getBookingById,
  updateBook,
  deleteBook,
};
