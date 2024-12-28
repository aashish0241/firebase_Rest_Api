const errorHandler = (err, req, res, next) => {
  console.error(`error for handler ${err.stack}`);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
