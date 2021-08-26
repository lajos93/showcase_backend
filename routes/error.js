function error(req, res, next) {
  res.status(404).json({
    message: "Not Found",
    errorCode: "404",
  });
}

module.exports = error;
