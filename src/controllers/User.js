const md5 = require("md5");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { access_token, address, User } = require("../models");
const { sendMail, response } = require("../utilities");
const Login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const givenPassword = md5(req.body.password);
      if (user.password == givenPassword) {
        const data = {
          user_id: user._id,
          token: jwt.sign(
            {
              user_id: user._id,
            },
            "secret",
            { expiresIn: "1h" }
          ),
        };
        await access_token.create(data);
        res.send(response("user token", 0, data.token));
      } else {
        res.send(response("password not matched", 1));
      }
    } else {
      res.send(response("user not exists", 1));
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
const Register = async (req, res) => {
  try {
    if (req.body.password == req.body.conf_password) {
      const data = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: md5(req.body.password),
      };
      const user = await User.create(data);
      const mailData = {
        email: user.email,
        about: "confirmation mail",
        msg: "user registered",
      };
      await sendMail(mailData);
      res.send(response("usercreated and mail sent", 0));
    } else {
      res.send(response("password and confirm password did not matched", 1));
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
const UserDelete = async (req, res) => {
  try {
    const token = req.token;
    await User.deleteOne({ _id: token.user_id });
    const AddressDeleted = await address.deleteMany({ user_id: token.user_id });
    await access_token.deleteMany({ user_id: token.user_id });
    if (AddressDeleted.deletedCount != 0) {
      res.send(response("User deleted", 0));
    } else {
      res.send(
        response(
          "User deleted but this user has no addresss associated with it",
          1
        )
      );
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
const UserGet = async (req, res) => {
  try {
    const token = req.token;
    const user = await User.findOne({ _id: token.user_id }).populate("address");
    if (user) {
      res.send(response("user ", 0, user));
    } else {
      res.send(response("user not found", 1));
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
const UserGetId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate("address");
    if (user) {
      res.send(response("user", 0, user));
    } else {
      res.send(response("no user exists with this id", 1));
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
const UserList = async (req, res) => {
  try {
    const page = req.params.page - 1;
    const limitNumber = 10;
    const skipNumber = page * 10;
    const users = await User.find({}).limit(limitNumber).skip(skipNumber);
    res.send(response("users", 0, users));
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const tokenData = {
        user_id: user._id,
        token: jwt.sign(
          {
            user_id: user._id,
          },
          "secret",
          { expiresIn: "10m" }
        ),
      };
      const resettoken = await access_token.create(tokenData);
      const mailData = {
        email: user.email,
        about: "reset token mail",
        msg: `http://localhost:3000/user/verify_reset_password/${resettoken.token}`,
      };
      await sendMail(mailData);
      res.send(response("token", 0, resettoken.token));
    } else {
      res.send(response("no user exists with this username", 1));
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
const passwordReset = async (req, res) => {
  try {
    const token = req.token;
    const newPassword = md5(req.body.password);
    const user = await User.findOneAndUpdate(
      { _id: token.user_id },
      { $set: { password: newPassword } }
    );
    await access_token.deleteOne({ _id: token._id });
    const mailData = {
      email: user.email,
      about: "Confirmation Mail",
      msg: "password changed successfully",
    };
    await sendMail(mailData);
    res.send(response("password changed", 0));
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
};
module.exports = {
  Login,
  Register,
  UserDelete,
  UserGet,
  UserGetId,
  UserList,
  forgotPassword,
  passwordReset,
};
