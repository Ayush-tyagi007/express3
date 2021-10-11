const { resetToken } = require("../models");
const jwt = require("jsonwebtoken");
async function resetTokenVerifier(req, res, next) {
  try {
    console.log(1)
    const token = await resetToken.findOne({
      token: req.params.password_reset_token,
    });
    console.log(token)
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
module.exports = { resetTokenVerifier };
