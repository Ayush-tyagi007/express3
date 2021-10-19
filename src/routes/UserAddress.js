const express = require("express");
const { UserAddressController } = require("../controllers");
const { expiryValidator } = require("../middleware");
const router = express.Router();
router.post("/address", expiryValidator, UserAddressController.UserAddress);
router.put(
  "/deleteaddress",
  expiryValidator,
  UserAddressController.UserAddressDelete
);
module.exports = router;
