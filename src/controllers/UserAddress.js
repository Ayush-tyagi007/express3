const { User } = require("../models/Usermodel");
const { address } = require("../models/AddressModel");
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
const UserAddressDelete = async (req, res) => {
  try {
    const token = req.token;
    const addressid = req.headers.addressid;
    await User.findOneAndUpdate(
      { _id: token.user_id },
      { $pull: { address: addressid } }
    );
    const deletedaddress = await address.deleteOne({
      _id: req.headers.addressid,
    });
    res.send("address deleted");
      // addressid.map(profile,key){

      // }
  } catch (e) {
    res.send(e);
  }
};
module.exports = { UserAddress, UserAddressDelete };
