const { constants } = require("../constants");

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  // stackTrace: error.stack
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({ title: "Validation Failed", status: statusCode, message: error.message });
      break;
    case constants.NOT_FOUND:
        res.json({ title: "Not Found", status: statusCode, message: error.message });
        break;
    case constants.UNAUTHORIZED:
        res.json({ title: "Unauthorized Access", status: statusCode, message: error.message });
        break;
    case constants.FORBIDDEN:
        res.json({ title: "Forbidden", status: statusCode, message: error.message });
        break;
    case constants.SERVER_ERROR:
        res.json({ title: "Server Error", status: statusCode, message: error.message });
        break;
    default:
        console.log("No Error!!!")
        break;
  }
  next();
};

module.exports = errorHandler;
