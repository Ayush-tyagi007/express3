const multer = require("multer");
const express = require("express");
const router = express.Router();
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });
router.post("/profile", upload.single("image"), (req, res, next) => {
  res.send(req.file);
});
module.exports = router;
