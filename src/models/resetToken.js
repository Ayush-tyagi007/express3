const mongoose = require("mongoose");
const reset_tokenSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  token: String,
});
const reset_token = mongoose.model("reset_token", reset_tokenSchema);
module.exports = { reset_token };
