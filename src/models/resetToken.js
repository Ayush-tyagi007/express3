const mongoose = require("mongoose");
const resetTokenSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    token: String,
  });
  const reset_token = mongoose.model("reset_token", resetTokenSchema);
  module.exports = { reset_token };
  