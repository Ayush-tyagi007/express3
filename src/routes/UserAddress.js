const express = require("express");
const { UserAddressController } = require("../controllers/index");
const { expiryValidator } = require("../middleware/expiryValidator");
const router = express.Router();
router.post(
  "/address",
  expiryValidator,
  UserAddressController.UserAddress
);
router.put(
  "/deleteaddress",
  expiryValidator,
  UserAddressController.UserAddressDelete
);
module.exports = router;
