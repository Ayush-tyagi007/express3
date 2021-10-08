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
    addressArray = req.body;
    addressArray.forEach((element) => {
      addressDelete(element);
    });
  } catch (e) {
    res.send(e);
  }
};
async function addressDelete(element) {
  try {
    const deletedaddress = await address.findOneAndDelete(
      { _id: element },
      { projection: { user_id: 1 } }
    );
    if (deletedaddress != null) {
      await User.findOneAndUpdate(
        { _id: deletedaddress.user_id },
        { $pull: { address: deletedaddress._id } }
      );
      console.log(`address deleted for this id ${element}`);
    } else {
      console.log(`no address found for this id ${element}`);
    }
  } catch (er) {
    res.send(er);
  }
}
module.exports = { UserAddress, UserAddressDelete };
