const { User ,address} = require("../models");
const {response}=require("../utilities")
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
    res.send(response("address created",0,createdAddress));
  } catch (er) {
    res.send(response([er.message||"an error generated in try block"],1));
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
    res.send(response("address deleted",0));
  } catch (er) {
    res.send(response([er.message||"an error generated in try block"],1));
  }
};
module.exports = { UserAddress, UserAddressDelete };
