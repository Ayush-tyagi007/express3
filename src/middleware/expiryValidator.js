const { access_token } = require("../models");
const { response } = require("../utilities");
const jwt = require("jsonwebtoken");
async function expiryValidator(req, res, next) {
  try {
    jwt.verify(req.headers.access, "secret");
    const token = await access_token.findOne({ token: req.headers.access });
    if (token) {
      req.user_id = token.user_id;
      next();
    } else {
      res.send(response("token not exist", 1));
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
}
module.exports = expiryValidator;
