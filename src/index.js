const express = require("express");
const mongoose = require("mongoose");
const UserController = require("./controllers/UserController");
const { auth } = require("./middleware/authentication");
const { expiryValidator } = require("./middleware/expiryValidator");
const { AddressDelete } = require("./controllers/AddressDelete");
const routers = require("./routes/routes");
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const port = 3000 || process.env.PORT;
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
app.use("/user", routers);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
