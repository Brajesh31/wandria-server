const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../model/user.model");
const dataform = require("../utils/dataForm");
const jwt = require("jsonwebtoken");
const genrateToken = require("../utils/genrateToken");

const getAccount = asyncWrapper(async (req, res) => {
  const refresh_token = req.cookies["refresh-token"];
  if (!refresh_token) {
    return res.status(401).json({ message: "refresh token missing." });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN);
    const user = await User.findById(decoded.id)
      .select("-password");
    if (!user) {
      return res.status(404).json(dataform("faild", 404, "invalid user id"));
    }

    const token = genrateToken({
      id: user._id,
      role: user.role,
    });

    return res.status(200).json(
      dataform("success", 200, "successfully operation", {
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        birth_day: user.birth_day,
      })
    );
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invaild Refresh Token", error: error.message });
  }
});

module.exports = getAccount;
