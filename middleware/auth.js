const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  // console.log(header)
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authorization;
