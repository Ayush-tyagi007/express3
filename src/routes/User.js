const express = require("express");
const { UserController } = require("../controllers");
const { auth } = require("../middleware/authentication");
const { expiryValidator } = require("../middleware/expiryValidator");
const router = express.Router();
router.post("/register", auth, UserController.Register);
router.post("/login", UserController.Login);
router.get("/get", expiryValidator, UserController.UserGet);
router.get("/get/:id", expiryValidator, UserController.UserGetId);
router.put("/delete", expiryValidator, UserController.UserDelete);
router.get("/list/:page", UserController.UserList);
router.post("/forgotPassword",UserController.forgotPassword)
module.exports = router;
