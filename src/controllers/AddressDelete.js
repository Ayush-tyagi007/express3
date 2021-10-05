const { address } = require("../models/AddressModel");
const { User } = require("../models/Usermodel");
const bodyParser = require("body-parser");
const AddressDelete = async (req, res) => {
  try {
    const token = req.token;
    const addressid = req.headers.addressid;
    const id = addressid.toString();
    await User.findOneAndUpdate(
      { _id: token.user_id },
      { $pull: { address: new ObjectId(id) } }
    );
    const deletedaddress = await address.deleteOne({
      _id: req.headers.addressid,
    });
  } catch (e) {
    res.send(e);
  }
};
module.exports = { AddressDelete };
