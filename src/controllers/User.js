const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { reset_token } = require("../models/resetToken");
const { User } = require("../models/Usermodel");
const { access_token } = require("../models/Access_tokenModel");
const { address } = require("../models/AddressModel");
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
        res.send(data.token);
      } else {
        res.status(500).send("password not matched");
      }
    } else {
      res.send("user not exists");
    }
  } catch (er) {
    res.send(er);
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
      await User.create(data);
      res.send("usercreated");
    } else {
      res.send("password and confirm password did not matched");
    }
  } catch (er) {
    res.send(er);
  }
};
const UserDelete = async (req, res) => {
  try {
    const token = req.token;
    const deletedUser = await User.deleteOne({ _id: token.user_id });
    const deletionCount = await address.deleteMany({ user_id: token.user_id });
    await access_token.deleteOne({ user_id: token.user_id });
    if (deletionCount.deletedCount != 0) {
      res.send("user deleted");
    } else {
      res.send("User deleted but this user has no addresss associated with it");
    }
  } catch (er) {
    res.send(er);
  }
};
const UserGet = async (req, res) => {
  try {
    const token = req.token;
    if (token.user_id) {
      const user = await User.findOne({ _id: token.user_id }).populate(
        "address"
      );
      if (user) {
        res.status(200).send(user);
      } else {
        res.send("user already deleted");
      }
    } else {
      res.send("token for this user id does not exist");
    }
  } catch (er) {
    res.send(er);
  }
};
const UserGetId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate("address");
    if (user) {
      res.send(user);
    } else {
      res.send("no user exists with this id");
    }
  } catch (er) {
    res.send(er);
  }
};
const UserList = async (req, res) => {
  try {
    const page = req.params.page - 1;
    const limitNumber = 10;
    const skipNumber = page * 10;
    const users = await User.find({}).limit(limitNumber).skip(skipNumber);
    res.send(users);
  } catch (er) {
    res.send(er);
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
      const resettoken = await reset_token.create(tokenData);
      res.send(resettoken.token);
    } else {
      res.send("no user exists with this username");
    }
  } catch (e) {
    res.send(e);
  }
};
const passwordReset = async (req, res) => {
  try {
    const token = req.token;
    const newPassword = md5(req.body.password);
    await User.findOneAndUpdate(
      { _id: token.user_id },
      { $set: { password: newPassword } }
    );
    await reset_token.deleteOne({ _id: token._id });
    res.send("password changed");
  } catch (e) {
    res.send(e);
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
