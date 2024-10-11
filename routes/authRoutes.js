// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  profile,
  authorize,
  redirect,
} = require("../controller/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", profile);
router.get("/authorize", authorize);
router.get("/redirect", redirect);

module.exports = router;
