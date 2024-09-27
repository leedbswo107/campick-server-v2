const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  postCount: {
    type: Number,
    required: true,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
  missionClear: {
    type: Number,
    required: true,
  },
  bingoCount: {
    type: Number,
    required: true,
  },
  continuousConnection: {
    type: Number,
    required: true,
  },
});
const Mission = mongoose.model("Mission", missionSchema);

module.exports = Mission;
