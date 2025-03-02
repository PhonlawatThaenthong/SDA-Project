const mongoose = require("mongoose");

const ImageDetailsSchema = new mongoose.Schema({
  path: String,
  filename: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Store User ID
  username: String, // Store Username
  fileSize: { type: Number, default: 0 }, // Added field to store file size in bytes
  uploadDate: { type: Date, default: Date.now } // Added field to track upload date
});

const ImageDetails = mongoose.model("ImageDetails", ImageDetailsSchema);

module.exports = {ImageDetails}