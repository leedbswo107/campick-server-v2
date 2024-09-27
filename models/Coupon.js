const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  // condition -> ex) 1 bingo Coupon
  condition: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  serialNum: {
    type: String,
    required: true,
    default: () => Math.random().toString().slice(2, 14),
  },
  status: {
    type: String,
    required: true,
    enum: ["inactive", "active", "expired"],
    default: "inactive",
  },
  activeDate: {
    type: Date,
    default: null,
  },
  expireDate: {
    type: Date,
    default: null,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
