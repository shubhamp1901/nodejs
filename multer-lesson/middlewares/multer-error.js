const multerErrorHandler = (error, req, res, next) => {
  if (res.isMulter) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = multerErrorHandler
