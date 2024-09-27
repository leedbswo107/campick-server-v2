const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    // unique: true,
  },
  loginDate: {
    type: Array,
    required: true,
  },
  // time form "2011-10-05T14:48:00.000Z"
});

const User = mongoose.model("User", userSchema);

module.exports = User;
