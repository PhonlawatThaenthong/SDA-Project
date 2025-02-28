const mongoose = require("mongoose");

const ImageDetailsScehma = new mongoose.Schema(
  {
   path : {type:String,required:true},
   filename : {type:String,required:true},
  }
);

const ImageDetails = mongoose.model("ImageDetails", ImageDetailsScehma);

module.exports = {ImageDetails}