const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const image = mongoose.model("image", ImageSchema);
module.exports = image;
