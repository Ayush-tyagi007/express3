const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { User } = require("../models/Usermodel");
const { access_token } = require("../models/Access_tokenModel");
const { address } = require("../models/AddressModel");
const passport = require("passport");
var localStrategy = require("passport-local").Strategy;
const Login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      password = req.body.password;
      const validate = await user.authenticate(
        password,
        async function (cb, data) {
          if (data) {
            tokenData = {
              user_id: data._id,
              token: jwt.sign(
                {
                  user_id: data._id,
                },
                "secret",
                { expiresIn: "1h" }
              ),
            };
            const access = await access_token.create(tokenData);
            res.send(access.token);
          } else {
            res.status(500).send("password not matched");
          }
        }
      );
      //   const givenPassword = md5(req.body.password);
      //   if (user.password == givenPassword) {
      //     const data = {
      //       user_id: user._id,
      //       token: jwt.sign(
      //         {
      //           user_id: user._id,
      //         },
      //         "secret",
      //         { expiresIn: "1h" }
      //       ),
      //     };
      //     await access_token.create(data);
      //     res.send(data.token);
      //   } else {
      //     res.status(500).send("password not matched");
      //   }
    } else {
      res.send("user not exists");
    }
  } catch (er) {
    console.log(er);
    res.send(er);
  }
};
const Register = async (req, res) => {
  try {
    if (req.body.password == req.body.conf_password) {
      const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
      });
      await User.register(newUser, req.body.password);
      res.send("user registered");
    } else {
      res.send("password and confirm password not matched");
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
module.exports = {
  Login,
  Register,
  UserDelete,
  UserGet,
  UserGetId,
  UserList,
};
