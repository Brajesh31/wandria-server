const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../model/user.model");
const dataform = require("../utils/dataForm");
const bcrypt = require("bcrypt");
const genrateToken = require("../utils/genrateToken");
const Booking = require("../model/booking.model");

const getAllUsers = asyncWrapper(async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    const usersData = await Promise.all(
      allUsers.map(async (user) => {
        const userBookings = await Booking.find({ user_id: user._id }).populate(
          "trip_id",
          "title price seats duration location country"
        );

        return {
          ...user.toObject(),
          bookings: userBookings,
        };
      })
    );

    return res
      .status(200)
      .json(dataform("success", 200, "successfully operation", usersData));
  } catch (error) {
    return res
      .status(500)
      .json(dataform("error", 500, "Internal server error"));
  }
});

const addUser = asyncWrapper(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    image,
    birth_day,
    phone,
    gender,
    role,
  } = req.body;
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return res.status(400).json(dataform("faild", 400, "invalid user data"));
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashPwd,
      image,
      birth_day,
      phone,
      gender,
      role,
    });
    if (!newUser) {
      return res
        .status(400)
        .json(dataform("faild", 400, "faild to add user ,try again."));
    }

    const token = genrateToken({
      id: newUser._id,
      role: newUser.role,
    });

    const refreshToken = genrateToken(
      {
        id: newUser._id,
        role: newUser.role,
      },
      "refresh",
      "refresh"
    );

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json(
      dataform("success", 201, "user added successfully", {
        token,
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        gender: newUser.gender,
        image: newUser.image,
        birth_day: newUser.birth_day,
        trips: newUser.trips,
      })
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const getUserById = asyncWrapper(async (req, res) => {
  const users = await User.findById(req.params.id);
  if (!users) res.status(404).json(dataform("faild", 404, "invalid user id"));

  res
    .status(200)
    .json(dataform("success", 200, "successfully operation", users));
});

const updateUserData = asyncWrapper(async (req, res) => {
  const userData = await User.findByIdAndUpdate(req.params.id, {
    ...req.body,
  }).select("-password");
  if (!userData)
    res.status(404).json(dataform("faild", 404, "invalid user data"));

  res
    .status(201)
    .json(dataform("success", 201, "user updated successfully", userData));
});

const deleteUser = asyncWrapper(async (req, res) => {
  const delUser = await User.deleteOne({ _id: req.params.id });

  res.status(201).json(dataform("success", 201, "user deleted successfully"));
});

module.exports = {
  getAllUsers,
  addUser,
  getUserById,
  updateUserData,
  deleteUser,
};
