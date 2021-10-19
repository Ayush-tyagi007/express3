const response = (msg, status, result) => {
  const responseData = {
    status: status,
    message: msg,
    result: result,
  };
  return responseData;
};

module.exports = response;
