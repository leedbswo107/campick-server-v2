const {
  updateUserData,
  deleteUser,
  duplicateNickname,
  passwordCheck,
  getUserById,
} = require("../services/userServices");

const {
  getMission,
  getMissionClear,
  getBingoCount,
  getContinuousConnection,
  updateBingo,
  updateMissionList,
  getBingoPattern,
  resetMission,
  resetBingo,
  getUserBingo,
} = require("../services/bingoService");

const {
  getCoupons,
  availableCoupons,
  removeCoupon,
  expiredCoupon,
} = require("../services/couponService");

const { getBlogPostByAuthorId } = require("../services/blogPostService");
const { getSalePostById } = require("../services/salePostService");

const { createInquiry } = require("../services/inquiryService");

const { bingoMission } = require("../utils/bingoMission");
const { syncBingo } = require("../utils/syncBingo");

const updateInquiry = async (req, res) => {
  try {
    const { title, email, content } = req.body;
    const inquiryDoc = await createInquiry(title, email, content);
    if (inquiryDoc) res.status(200).json({ result: true, inquiryDoc });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const { nickname, password } = req.body;
    const userData = await updateUserData(userObjId, nickname, password);
    if (userData.result) res.status(200).json({ result: true });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const deleteUserInfo = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const deletedUser = await deleteUser(userObjId);
    console.log("deletedUser", deletedUser);
    if (deletedUser.result)
      res
        .status(200)
        .cookie("token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: new Date(0), // 만료 날짜를 과거로 설정하여 쿠키 삭제
          path: "/", // 모든 경로에서 쿠키 삭제
          sameSite: "none",
        })
        .json({ result: true, message: deletedUser.message });
    console.log("success");
  } catch (error) {
    res.status(500).json({ result: false, message: error.message });
  }
};
const duplicateCheck = async (req, res) => {
  try {
    const { nickname } = req.body;
    const nicknameDoc = await duplicateNickname(nickname);
    if (nicknameDoc)
      res.status(200).json({ result: true, message: nicknameDoc.message });
  } catch (error) {
    res.status(409).json({ result: false, message: error.message });
  }
};
const pwCheck = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const { password } = req.body;
    const passwordDoc = await passwordCheck(userObjId, password);
    if (passwordDoc) {
      res.status(200).json({ result: true });
    }
  } catch (error) {
    res.status(401).json({ result: false, message: error.message });
  }
};
const updateMission = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const { postCount, reviewCount } = await getMission(userObjId);
    const missionClear = await getMissionClear(userObjId);
    const bingoCount = await getBingoCount(userObjId);
    const user = await getUserById(userObjId);
    const continuousConnection = await getContinuousConnection(user);

    const newMission = {
      postCount,
      reviewCount,
      missionClear,
      bingoCount,
      continuousConnection,
    };
    const checkedMission = bingoMission(newMission);
    const bingo = await getUserBingo(userObjId);
    const mission = await updateMissionList(userObjId, newMission);
    const updatedBingo = await syncBingo(bingo, checkedMission);
    const newestBingo = await updateBingo(userObjId, updatedBingo);
    if (newestBingo)
      res.status(200).json({ result: true, mission, bingo: updatedBingo });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const getBingo = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingo = await getUserBingo(userObjId);
    res.status(200).json({ bingo });
  } catch (error) {
    console.error(error);
  }
};
const getBingoCountFunc = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingoCount = await getBingoCount(userObjId);
    res.status(200).json({ bingoCount });
  } catch (error) {
    console.error(error);
  }
};
const getBingoPatternStatus = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingoPattern = await getBingoPattern(userObjId);
    res.status(200).json({ bingoPattern });
  } catch (error) {
    console.error(error);
  }
};
const bingoStatusReset = async (req, res) => {
  try {
    const userObjId = req.params.id;
    const bingo = await resetBingo(userObjId);
    await resetMission(userObjId);
    res.status(200).json({ result: true, bingo });
  } catch (error) {
    console.error(error);
  }
};
const getPost = async (req, res) => {
  try {
    const authorId = req.params.id;
    const blogPost = await getBlogPostByAuthorId(authorId);
    res.status(200).json({ result: true, blogPost });
  } catch (error) {
    console.error(error);
  }
};
const getSalePost = async (req, res) => {
  try {
    const authorId = req.params.id;
    const salePost = await getSalePostById(authorId);
    res.status(200).json({ result: true, salePost });
  } catch (error) {
    console.error(error);
  }
};

const getCouponList = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const couponList = await getCoupons(ownerId);
    res.status(200).json({ result: true, couponList });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const checkCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    const userCoupon = await availableCoupons(ownerId, coupon);
    if (!userCoupon) {
      res.status(200).json({ result: true, message: "쿠폰이 없습니다." });
    }
    if (userCoupon && userCoupon.status === "active")
      res.status(401).json({ message: "쿠폰이 있습니다." });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const issuanceCoupon = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { coupon } = req.body;
    await createCoupon(ownerId, coupon);
    res.status(201).json({ result: true, message: "새로운 쿠폰 발급 완료" });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const deleteCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await removeCoupon(id);
    res.status(204).json({ result: true, message: "삭제 완료" });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};
const couponStatusChange = async (req, res) => {
  try {
    const couponId = req.params.id;
    await expiredCoupon(couponId);
    res.status(204).json({ result: true, message: "상태 변경 완료" });
  } catch (error) {
    res.status(400).json({ result: false, message: error.message });
  }
};

module.exports = {
  updateInquiry,
  deleteUserInfo,
  duplicateCheck,
  pwCheck,
  updateUser,
  getBingo,
  getBingoCountFunc,
  getBingoPatternStatus,
  getPost,
  updateMission,
  bingoStatusReset,
  checkCoupon,
  issuanceCoupon,
  getCouponList,
  deleteCoupon,
  couponStatusChange,
  getSalePost,
};
