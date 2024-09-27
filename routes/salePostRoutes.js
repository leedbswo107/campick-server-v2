const { Router } = require("express");
const {
  getSalePosts,
  getSalePostById,
  createSalePost,
  updateSalePost,
  deleteSalePost,
} = require("../controller/salePostController.js");
const { checkAuth } = require("../middleware/checkAuth.js");
const { fileUpload } = require("../utils/fileUpload.js");

const router = Router();
router.route("/").get(getSalePosts);
router.route("/").post(checkAuth, fileUpload.array("images"), createSalePost);

router
  .route("/:id")
  .get(getSalePostById)
  .put(updateSalePost)
  .delete(deleteSalePost);

module.exports = router;
