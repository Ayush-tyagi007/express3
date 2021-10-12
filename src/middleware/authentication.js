const mongoose = require("mongoose");
const express = require("express");
const { User } = require("../models");
async function auth(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (user) {
      if (user.username == req.body.username) {
        res.send(response("username exists", 1));
      } else if (user.email == req.body.email) {
        res.send(response("user with this email exist", 1));
      }
    } else {
      next();
    }
  } catch (er) {
    res.send(response([er.message || "an error generated in try block"], 1));
  }
}

module.exports = auth;
