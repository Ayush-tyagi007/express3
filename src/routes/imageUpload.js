const { imageController } = require("../controllers");
const { expiryValidator } = require("../middleware");
const multer = require("multer");
const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const fileupload = require("express-fileupload");
router.use(fileupload({ useTempFiles: true }));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/home/etech/Desktop/express3/upload");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post(
  "/profile",
  upload.single("image"),
  expiryValidator,
  imageController.imageUploadLocally
);
router.post(
  "/online_upload",
  upload.single("image"),
  expiryValidator,
  imageController.imageUploadOnline
);
module.exports = router;
