const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    trip_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: [true, "Trip ID is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      required: true,
    },
    booked_at: {
      type: Date,
      default: () => new Date(),
    },
    // number_of_seats: {
    //   type: Number,
    //   required: [true, "Number of seats is required"],
    //   min: [1, "You must book at least 1 seat"],
    // },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
