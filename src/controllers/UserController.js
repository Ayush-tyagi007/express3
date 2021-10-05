const md5 = require("md5");
var jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
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

const UserAddress = async (req, res) => {
  try {
    const token = req.token;
    const data = {
      user_id: token.user_id,
      phone_no: req.body.phone_no,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pin_code: req.body.pin,
    };
    const createdAddress = await address.create(data);
    const updatedUser = await User.findOneAndUpdate(
      { _id: token.user_id },
      { $push: { address: createdAddress._id } }
    );
    res.send(createdAddress);
  } catch (err) {
    res.send(err);
  }
};
const UserDelete = async (req, res) => {
  try {
    const token = req.token;
    const deletedUser = await User.deleteOne({ _id: token.user_id });
    await address.deleteMany({ user_id: token.user_id });
    res.send("user deleted");
  } catch (er) {
    res.send(er);
  }
};
const UserGet = async (req, res) => {
  try {
    const token = req.token;
    if (token.user_id) {
      const userAddress = await User.find({ _id: token.user_id }).populate(
        "address"
      );
      res.status(200).send(userAddress);
    } else {
      res.send("token for this user id does not exist");
    }
  } catch (er) {
    res.send(er);
  }
};
const UserGetId = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id }).populate("address");
    if (userAddress) {
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
  UserAddress,
  UserDelete,
  UserGet,
  UserGetId,
  UserList,
};
