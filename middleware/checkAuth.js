const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ result: false, message: "로그인이 필요합니다" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret");

    if (!decoded) {
      return res
        .status(401)
        .json({ result: false, message: "토큰이 유효하지 않습니다." });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: "존재하지 않는 유저 아이디입니다." });
    }

    // {username, id}
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in checkAuth middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { checkAuth };
