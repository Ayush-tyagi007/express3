const mongoose = require("mongoose");
const access_tokenSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  token: String,
});
const access_token = mongoose.model("access_token", access_tokenSchema);
module.exports = { access_token };
