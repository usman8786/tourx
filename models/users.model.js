const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;

const User = new Schema({
  _id: {
    type: String,
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
    unique: true,
    sparse: true,
  },
  access: {
    type: String,
    default: "User",
  },
  emailVerified:{
    type:Boolean,
    default: false
  },
  phoneVerified:{
    type:Boolean,
    default: false
  },
  userName:{
    type:String
  }
});

User.plugin(mongoosePaginate);
User.plugin(autoIncrement.plugin, "User");

User.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};
// User.index({'$**': 'text'});

module.exports = mongoose.model("User", User);
