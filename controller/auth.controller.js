const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const dataform = require("../utils/dataForm");
const genrateToken = require("../utils/genrateToken");
const ImageKit = require("imagekit");

const register = asyncWrapper(async (req, res) => {
  const { name, email, password, image, birth_day } = req.body;

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return res
      .status(400)
      .json(dataform("faild", 400, "invalid email or user data"));
  }

  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPwd,
    image,
    birth_day,
  });

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
    dataform("success", 201, "user successfully added", {
      token,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      image: newUser.image,
      birth_day: newUser.birth_day,
    })
  );
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email });
  if (!checkUser) {
    return res.status(404).json(dataform("faild", 404, "invalid email"));
  }

  const pwdComapre = await bcrypt.compare(password, checkUser.password);
  if (!pwdComapre) {
    return res.status(400).json(dataform("faild", 400, "invalid password"));
  }

  const token = genrateToken({
    id: checkUser._id,
    role: checkUser.role,
  });

  const refreshToken = genrateToken(
    {
      id: checkUser._id,
      role: checkUser.role,
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

  res.status(200).json(
    dataform("success", 200, "user loged in successfully", {
      token,
      _id: checkUser._id,
      name: checkUser.name,
      email: checkUser.email,
      role: checkUser.role,
      image: checkUser.image,
      birth_day: checkUser.birth_day,
    })
  );

  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const imageKitAuth = asyncWrapper(async (req, res) => {
  const image_kit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  });

  const { token, expire, signature } = image_kit.getAuthenticationParameters();

  res.send({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
});

const logout = asyncWrapper(async (req, res) => {
  res.clearCookie("refresh-token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(dataform("success", 200, "user loged out successfully"));
});

module.exports = { register, login, imageKitAuth, logout };
