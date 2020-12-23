const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const Post = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  postTitle: {
    type: String,
  },
  postDescription:{
    type:String
  },
  userId:{
    type:Number,
  },
  days:{
    type:[Object],
  },
  packages:{
    type:[Object]
  },
  totalSlots:{
    type:Number
  },
  locationsToVisit:{
    type:[Object]
  },
  servicesIncluded:{
    type:[Object]
  },
  servicesNotIncluded:{
    type:[Object]
  },
  mustBring:{
    type:[Object]
  },
  sops:{
    type:[Object]
  },
  payementProcedures:{
    type:[Object]
  },
  bookingDate:{
    type:String
  },
  bookingEnd:{
    type:String
  },
  refundPolicy:{
    type:[Object]
  },
  termsConditions:{
    type:[Object]
  },
  contact:{
    type:[Object]
  },
  email:{
    type:String
  },
  socialsLinks:{
    type:[Object]
  },
});

Post.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", Post);
