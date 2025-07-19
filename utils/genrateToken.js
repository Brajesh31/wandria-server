const jwt = require("jsonwebtoken");

function genrateToken(payload, type = "access", secret = "access") {
  if (!process.env.JWT_ACCESS_TOKEN) {
    throw new Error("jwt secret not found");
  }

  const secretKey =
    secret === "access"
      ? process.env.JWT_ACCESS_TOKEN
      : process.env.JWT_REFRESH_TOKEN;

  const expiresIn =
    type === "access"
      ? process.env.ACCESS_JWT_EXPIRES_IN
      : process.env.REFRESH_JWT_EXPIRES_IN;

  return (token = jwt.sign(payload, secretKey, { expiresIn }));
}

module.exports = genrateToken;
