// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  profile,
} = require("../controller/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", profile);

module.exports = router;
