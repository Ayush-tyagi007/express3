const { resetToken } = require("../models");
const jwt = require("jsonwebtoken");
async function resetTokenVerifier(req, res, next) {
  try {
    const token = await resetToken.findOne({
      token: req.params.password_reset_token,
    });
    if (token) {
      jwt.verify(token.token, "secret");
      req.token = token;
      next();
    } else {
      res.send(response("token not exist", 1));
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
}
module.exports = resetTokenVerifier;
