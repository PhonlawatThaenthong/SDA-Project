const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Store User ID
  username: String, // Store Username
  message: String,
  level: String,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log