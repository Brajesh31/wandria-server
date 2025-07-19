const protected = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not Allowed To Access" });
  }
  next();
};

module.exports = protected;
