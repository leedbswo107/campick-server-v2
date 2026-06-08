const { Router } = require("express");
const {
  getCheckoutById,
  createCheckout,
} = require("../controller/checkoutController.js");
const { checkAuth } = require("../middleware/checkAuth.js");

const router = Router();

router.route("/").post(checkAuth, createCheckout);
router.route("/:id").get(checkAuth, getCheckoutById);

module.exports = router;
