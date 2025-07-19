const handler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const message = err.message || "Internal server error";
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ state: false, message: message });
};

module.exports = handler;