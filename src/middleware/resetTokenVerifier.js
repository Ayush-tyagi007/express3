const { reset_token } = require("../models/resetToken");
const jwt = require("jsonwebtoken");
async function resetTokenVerifier(req, res, next) {
  try {
    const token = await reset_token.findOne({
      token: req.params.password_reset_token,
    });
    if (token) {
      jwt.verify(token.token, "secret");
      req.token = token;
      next();
    } else {
      res.send("token not exist");
    }
  } catch (er) {
    res.send(er);
  }
}
module.exports = { resetTokenVerifier };
