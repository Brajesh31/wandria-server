const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      minlength: [5, "Email must be at least 5 characters"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must be at least 5 characters"],
    },
    image: {
      type: String,
      trim: true,
    },
    birth_day: {
      type: Date,
      required: [true, "Birth day is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
