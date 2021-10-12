const multer = require("multer");
const {response}=require("../utilities")
const express = require("express");
const Image = require("../models/Imagemodel");
const router = express.Router();
const fileupload = require("express-fileupload");
router.use(fileupload({ useTempFiles: true }));
const cloudinary = require("cloudinary").v2;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/profile", upload.single("image"), (req, res, next) => {
  console.log(req)
  res.send(response("image uploaded",0,req.files));
});
cloudinary.config({
  cloud_name: "imageupload6395",
  api_key: 878947817716679,
  api_secret: "8LA4bybX-ivPicOEubgzhYOasF8",
});
router.post("/online_upload", upload.single("image"), async (req, res) => {
  try {
    let imageuploaded = await cloudinary.uploader.upload(
      req.files.image.tempFilePath
    );
    const data = {
      image: imageuploaded.secure_url,
    };
    await Image.create(data);
    res.send(response("image uploaded successfully to cloudinary and path saved to database ",0))
  } catch (err) {
    res.send(response([err||"image not saved to cloudinary"],1))
  }
});
module.exports = router;
