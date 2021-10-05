const mongoose = require("mongoose");
const express = require("express");
const { access_token } = require("../models/Access_tokenModel");
const jwt = require("jsonwebtoken");
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
module.exports = { expiryValidator };
