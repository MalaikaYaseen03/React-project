const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cvSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  cvUrl: { type: String, required: true },
});

const CV_Model = mongoose.model("CV", cvSchema);
module.exports = CV_Model;