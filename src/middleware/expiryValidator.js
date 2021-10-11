const { access_token } = require("../models");
const jwt = require("jsonwebtoken");
async function expiryValidator(req, res, next) {
  try {
    const token = await access_token.findOne({ token: req.headers.access });
    if (token) {
      jwt.verify(token.token, "secret");
      req.token = token;
      next();
    } else {
      res.send("token not exist");
    }
  } catch (er) {
    res.send(response([er.message||"an error generated in try block"],1));
  }
}
module.exports = { expiryValidator };
