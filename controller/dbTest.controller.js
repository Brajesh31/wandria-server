const mongoose = require("mongoose");

try {
  console.log("=== STEP 1: CHECK MODELS ARE REGISTERED ===");
  const registeredModels = Object.keys(mongoose.models);
  console.log("All registered models:", registeredModels);

  console.log("\n=== STEP 2: CHECK RAW USER DATA ===");
  const rawUser = await User.findOne();
  console.log("Raw user found:", !!rawUser);
  console.log("User booking field:", rawUser?.booking);
  console.log("User trips field:", rawUser?.trips);
  console.log("Booking array length:", rawUser?.booking?.length || 0);
  console.log("Trips array length:", rawUser?.trips?.length || 0);

  if (rawUser?.booking?.length > 0) {
    console.log("First booking ID:", rawUser.booking[0]);
    console.log("ID type:", typeof rawUser.booking[0]);
    console.log(
      "Is ObjectId:",
      rawUser.booking[0] instanceof mongoose.Types.ObjectId
    );
  }

  console.log("\n=== STEP 3: CHECK IF BOOKING DOCUMENTS EXIST ===");
  if (rawUser?.booking?.length > 0) {
    // Try to find booking directly
    const bookingCount = await mongoose.model("Booking").countDocuments();
    console.log("Total bookings in database:", bookingCount);

    const specificBooking = await mongoose
      .model("Booking")
      .findById(rawUser.booking[0]);
    console.log("Specific booking found:", !!specificBooking);
    console.log("Booking data:", specificBooking);
  }

  console.log("\n=== STEP 4: CHECK IF TRIP DOCUMENTS EXIST ===");
  if (rawUser?.trips?.length > 0) {
    const tripCount = await mongoose.model("Trip").countDocuments();
    console.log("Total trips in database:", tripCount);

    const specificTrip = await mongoose
      .model("Trip")
      .findById(rawUser.trips[0]);
    console.log("Specific trip found:", !!specificTrip);
    console.log("Trip data:", specificTrip);
  }

  console.log("\n=== STEP 5: TRY DIFFERENT POPULATE METHODS ===");

  // Method 1: Simple populate
  const user1 = await User.findOne().populate("booking");
  console.log("Method 1 - Simple populate:");
  console.log("Booking populated:", user1?.booking);
  console.log("Is booking an array?", Array.isArray(user1?.booking));
  console.log("Booking length:", user1?.booking?.length);

  // Method 2: Explicit model
  const user2 = await User.findOne().populate({
    path: "booking",
    model: "Booking",
  });
  console.log("Method 2 - Explicit model:");
  console.log("Booking populated:", user2?.booking);

  // Method 3: Multiple populate calls
  const user3 = await User.findOne().populate("booking").populate("trips");
  console.log("Method 3 - Multiple populates:");
  console.log("Booking:", user3?.booking);
  console.log("Trips:", user3?.trips);

  console.log("\n=== STEP 6: CHECK SCHEMA DEFINITIONS ===");
  console.log("User schema paths:", Object.keys(User.schema.paths));
  console.log("Booking ref:", User.schema.paths.booking?.options?.ref);
  console.log("Trips ref:", User.schema.paths.trips?.options?.ref);

  return res.status(200).json({
    message: "Check console for detailed debugging info",
    summary: {
      modelsRegistered: registeredModels,
      userFound: !!rawUser,
      bookingIds: rawUser?.booking?.length || 0,
      tripIds: rawUser?.trips?.length || 0,
    },
  });
} catch (error) {
  console.error("Debug error:", error);
  return res.status(500).json({ error: error.message });
}
