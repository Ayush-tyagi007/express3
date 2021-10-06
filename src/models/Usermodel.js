const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
});
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);
module.exports = { User };
