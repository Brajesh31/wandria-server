const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const DaySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: [1, "Day number must be at least 1"],
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  activities: {
    type: [ActivitySchema],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "Each day must have at least one activity",
    },
  },
});

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    trim: true,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Trip title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [40, "Description must be at least 40 characters"],
    },
    price: {
      type: Number,
      min: [100, "Minimum price is 100"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
      default: "3 days",
    },
    bestTimeToVisit: {
      type: [String],
      required: [true, "Best time to visit is required"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((url) => typeof url === "string"),
        message: "Images must be an array of strings",
      },
    },
    location: {
      type: locationSchema,
      required: [true, "Location is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    trip_day: {
      type: Date,
    },
    interests: {
      type: String,
      required: [true, "Interest is required"],
    },
    travelStyles: {
      type: String,
      required: [true, "Travel style is required"],
      trim: true,
    },
    groupTypes: {
      type: String,
      enum: ["Solo", "Couple", "Family", "Friends", "Business"],
      required: [true, "group types is required"],
    },
    itinerary: {
      type: [DaySchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Itinerary must have at least one day",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Auto-calculate `trip_day` if not set, based on `duration`
tripSchema.pre("save", function (next) {
  if (!this.trip_day && this.duration) {
    const match = this.duration.match(/(\d+)/);
    if (match) {
      const days = parseInt(match[1], 10);
      const today = new Date();
      this.trip_day = new Date(today.setDate(today.getDate() + days));
    }
  }

  // Auto-calculate price based on groupTypes
  const basePrice = 200;
  const groupMultipliers = {
    Solo: 1,
    Couple: 2,
    Family: 4,
    Friends: 3,
    Business: 5,
  };

  const multiplier = groupMultipliers[this.groupTypes] || 1;
  this.price = basePrice * multiplier;

  next();
});

module.exports = mongoose.model("Trip", tripSchema);
