const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../models/Usermodel");
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
      }
    } else {
      next();
    }
  } catch (er) {
    res.send(er);
  }
}

module.exports = { auth };
