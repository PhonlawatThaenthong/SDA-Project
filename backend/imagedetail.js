const mongoose = require("mongoose");

const ImageDetailsSchema = new mongoose.Schema({
  path: String,
  filename: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Store User ID
  username: String, // Store Username
});

const ImageDetails = mongoose.model("ImageDetails", ImageDetailsSchema);

module.exports = {ImageDetails}