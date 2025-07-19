const Users = require("../model/user.model");
const Bookings = require("../model/booking.model");
const Trips = require("../model/trip.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const {
  getWeeklySummary,
  getMonthlySummary,
  getLatest,
} = require("../utils/latest");

const getLatestData = asyncWrapper(async (req, res) => {
  // Get bookings data
  const bookinWeekSummary = await getWeeklySummary(Bookings, "booked_at");
  const bookingMonthSummary = await getMonthlySummary(Bookings, "booked_at");

  // Get Trips data
  const tripsWeekSummary = await getWeeklySummary(Trips, "createdAt");
  const tripsMonthSummary = await getMonthlySummary(Trips, "createdAt");

  // Get Users data
  const usersWeekSummary = await getWeeklySummary(Users, "createdAt");
  const usersMonthSummary = await getMonthlySummary(Users, "createdAt");

  const data = {
    booking: { bookinWeekSummary, bookingMonthSummary },
    trips: { tripsWeekSummary, tripsMonthSummary },
    users: { usersWeekSummary, usersMonthSummary },
  };

  //   Get latest [users ,trips ,bookings] data
  const latestUsers = await getLatest(Users, "name email image _id");
  const latestBookings = await getLatest(Bookings);
  const latestTrips = await getLatest(
    Trips,
    "_id duration country groupTypes images price"
  );

  const latest = {
    users: latestUsers,
    trips: latestTrips,
    bookings: latestBookings,
  };

  //   Get [users ,trips ,bookings] full count
  const totalUsers = await Users.countDocuments();
  const totalTrips = await Trips.countDocuments();
  const totalBookings = await Bookings.countDocuments();
  const total = {
    users: totalUsers,
    trips: totalTrips,
    bookings: totalBookings,
  };

  res.status(200).json({ data, latest ,total });
});

module.exports = getLatestData;
