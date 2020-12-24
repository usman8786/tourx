const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const shortid = require("shortid");

const Verification = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  token: {
    type: String
  },
  verificationCode: {
    type: Number
  },
  userId: {
    type: Number
  }
});

module.exports = mongoose.model("Verification", Verification);
