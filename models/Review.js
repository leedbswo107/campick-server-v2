const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
    maxlength: 200,
  },
  contentId: {
    type: Number,
    required: true,
  },
});
reviewSchema.set("timestamps", true);
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
