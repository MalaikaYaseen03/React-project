const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//advance mongodb query search query
const aboutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phone: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

//two argument need in schema 1st one is name  and 2nd one is Schema
const About_Model = mongoose.model("About", aboutSchema);
module.exports = About_Model;
