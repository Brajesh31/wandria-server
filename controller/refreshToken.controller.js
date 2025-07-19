const asyncWrapper = require("../middleware/asyncWrapper");
const jwt = require("jsonwebtoken");
const genrateToken = require("../utils/genrateToken");

const refresh = asyncWrapper(async (req, res) => {
  const refresh_token = req.cookies["refresh-token"];
  if (!refresh_token) {
    return res.status(401).json({ message: "refresh token missing." });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN);
    const newAccessToken = genrateToken({
      id: decoded._id,
      role: decoded.role,
    });
    return res.json({ newAccessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invaild Refresh Token", error: error.message });
  }
});

module.exports = refresh;
