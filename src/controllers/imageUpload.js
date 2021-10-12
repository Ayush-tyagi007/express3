const { image } = require("../models");
const { response } = require("../utilities");
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const imageUploadLocally = async (req, res) => {
  try {
    const token = req.token;
    const data = {
      image: req.file.originalname,
      user_id: token.user_id,
    };
    const imageData = await image.create(data);
    res.send(response("image uploaded successfully", 0, imageData));
  } catch (er) {
    res.send(response([err || "an error generated in try block"], 1));
  }
};
const imageUploadOnline = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: "imageupload6395",
      api_key: 878947817716679,
      api_secret: "8LA4bybX-ivPicOEubgzhYOasF8",
    });
    const token = req.token;
    const imageuploaded = await cloudinary.uploader.upload(
      req.files.image.tempFilePath
    );
    const data = {
      image: imageuploaded.secure_url,
      user_id: token.user_id,
    };
    await image.create(data);
    res.send(
      response(
        "image uploaded successfully to cloudinary and path saved to database ",
        0
      )
    );
  } catch (err) {
    res.send(response([err || "image not saved to cloudinary"], 1));
  }
};
module.exports = { imageUploadLocally, imageUploadOnline };
