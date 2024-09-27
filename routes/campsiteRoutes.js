const { Router } = require("express");
const router = Router();

const {
  getReviews,
  createReview,
  deleteReview,
  editReview,
} = require("../controller/campsiteController");

// router.get("/review/:id", getReviews);
router.post("/create-review/:id", createReview);
router
  .route("/review/:id")
  .get(getReviews)
  .put(createReview)
  .post(editReview)
  .delete(deleteReview);

module.exports = router;
