const mongoose = require("mongoose");

const bingoSchema = new mongoose.Schema({
  bingo: {
    type: Array,
    required: true,
  },
});
const Bingo = mongoose.model("Bingo", bingoSchema);

module.exports = Bingo;
