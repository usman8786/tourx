const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const User = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  access: {
    type: String,
    default: "customer",
  },
  notificationToken: {
    type: String,
  },
});

User.plugin(mongoosePaginate);

User.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};
// User.index({'$**': 'text'});

module.exports = mongoose.model("User", User);
