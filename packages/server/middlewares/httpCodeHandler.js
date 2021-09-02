const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const notImplementedHandler = () => {
  const notImplemented = true;
  if (notImplemented) {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED);
  }
};

module.exports.notImplementedHandler = notImplementedHandler;
