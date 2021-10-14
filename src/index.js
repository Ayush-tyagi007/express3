const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./models/Usermodel");
const {forgotPassword}=require("./models/resetToken")
const { UserRouter, UserAddressRouter } = require("./routes");
var LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const port = process.env.PORT || 3000;
const connectDb = () =>
  new Promise((resolve, reject) => {
    try {
      resolve(
        mongoose.connect(
          "mongodb+srv://ayush:tyagi.apj@cluster0.oix8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
          { useNewUrlParser: true, useUnifiedTopology: true }
        )
      );
      console.log("connected to database");
    } catch (err) {
      reject(err);
    }
  });
connectDb();
app.use("/user", UserRouter);
app.use("/user", UserAddressRouter);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
