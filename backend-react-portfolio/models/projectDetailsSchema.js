const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for workDetails
const projectDetailsSchema = new Schema({
  slideImages: {
    type: [String], // Array of strings
    required: true,
  },
  pCategory: {
    type: String,
    required: true,
  },
  pClient: {
    type: String,
    required: true,
  },
  pDate: {
    type: String,
    required: true,
  },
  pURL: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Create the model
const ProjectDetails_Model = mongoose.model(
  "ProjectDetails",
  projectDetailsSchema
);

module.exports = ProjectDetails_Model;