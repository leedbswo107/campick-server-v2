const Review = require("../models/Review");

class ReviewService {
  async getReviewByContentId(contentId) {
    try {
      const reviews = await Review.find({ contentId }).populate("author");
      return reviews;
    } catch (error) {
      console.error(error);
    }
  }
  async createNewReview(author, score, review, contentId) {
    try {
      const newReview = await Review.create({
        author,
        score,
        review,
        contentId,
      });
      return newReview;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteReviewById(id) {
    try {
      await Review.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
    }
  }
  async editReviewById(id, score, review, contentId) {
    try {
      const editReview = await Review.findByIdAndUpdate(id, {
        score,
        review,
        contentId,
      });
      return editReview;
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = new ReviewService();
