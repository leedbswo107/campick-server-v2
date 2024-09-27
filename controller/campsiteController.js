const { countIncMission } = require("../services/bingoService");
const { getUserById } = require("../services/userServices");
const {
  getReviewByContentId,
  createNewReview,
  deleteReviewById,
  editReviewById,
} = require("../services/reviewService");

const getReviews = async (req, res) => {
  try {
    const contentId = req.params.id;
    const reviews = await getReviewByContentId(contentId);
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
  }
};
const createReview = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const { score, review, contentId } = req.body;
    const user = await getUserById(userObjId);

    if (!user) throw new Error("User not found");

    const newReview = await createNewReview(user._id, score, review, contentId);
    await countIncMission(userObjId, "reviewCount");
    res.status(200).json({ result: true, newReview });
  } catch (error) {
    console.error(error);
    res.status(403).json({ result: false });
  }
};
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await deleteReviewById(reviewId);
    res.status(200).json(review);
  } catch (error) {
    console.error(error);
  }
};
const editReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { score, review, contentId } = req.body;
    const editReview = await editReviewById(reviewId, score, review, contentId);
    res.status(200).json(editReview);
  } catch (error) {
    res.status(403).send("Error");
  }
};
module.exports = {
  getReviews,
  createReview,
  deleteReview,
  editReview,
};
