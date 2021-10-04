const mongoose = require("mongoose");
const express = require("express");
const { User, access_token } = require("../model");
const jwt = require("jsonwebtoken");
async function auth(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (user) {
      if (user.username == req.body.username) {
        res.send("username exists");
      } else if (user.email == req.body.email) {
        res.send("user with this email exist");
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (er) {
    res.send(er);
  }
}

async function expiryValidator(req, res, next) {
  try {
    const token = await access_token.findOne({ token: req.headers.access });
    try {
      const jstoken = jwt.verify(token.token, "secret");
      if (jstoken) {
        req.token = token;
        next();
      } else {
        res.send("token not exists");
      }
    } catch (err) {
      res.send("token expired");
    }
  } catch (er) {
    res.send(er);
  }
}
module.exports = { auth, expiryValidator };
