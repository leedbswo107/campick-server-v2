const User = require("../models/User");
const Mission = require("../models/Mission");
const Bingo = require("../models/Bingo");

const { shuffle } = require("../utils/shuffle");
const { bingoRule } = require("../utils/bingoRule");
const { missionClearCounter } = require("../utils/missionClearCounter");
const { consecutiveVisitDays } = require("../utils/consecutiveVisitDays");

const { BINGO_AREA } = require("../constants/bingoArea");

class BingoService {
  async createBingo(_id, bingo) {
    try {
      await Bingo.create({ _id, bingo });
    } catch (error) {
      console.error(error);
    }
  }
  async createMission(
    _id,
    postCount,
    reviewCount,
    missionClear,
    bingoCount,
    continuousConnection
  ) {
    try {
      await Mission.create({
        _id,
        postCount,
        reviewCount,
        missionClear,
        bingoCount,
        continuousConnection,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getUserBingo(id) {
    return await Bingo.findById(id);
  }
  async getMission(id) {
    const mission = await Mission.findById(id);
    return mission;
  }
  async getReviewCount(id) {
    const review = await Mission.findById(id);
    const count = review ? review.reviewCount : 0;
    return count;
  }
  async getPostCount(id) {
    const post = (await Mission.findById(id))
      ? await Mission.findById(id)
      : null;
    const count = post ? post.postCount : 0;
    return count;
  }
  async getMissionClear(id) {
    const getBingo = await Bingo.findById(id);
    const count = missionClearCounter(getBingo.bingo);
    return count;
  }
  async getBingoCount(id) {
    const getBingo = await Bingo.findById(id);
    const count = bingoRule(getBingo.bingo).count;
    return count;
  }
  async getContinuousConnection(user) {
    const loginDate = user ? user.loginDate : null;
    const count = loginDate ? consecutiveVisitDays(loginDate) : 1;
    return count;
  }
  async getBingoPattern(id) {
    const getBingo = await Bingo.findById(id);
    const pattern = bingoRule(getBingo.bingo).bingoPattern;
    return pattern;
  }
  async updateBingo(id, updatedBingo) {
    return await Bingo.findByIdAndUpdate(id, { $set: updatedBingo });
  }
  async countIncMission(_id, targetArea) {
    const incrementObject = {};
    incrementObject[targetArea] = 1;
    return await Mission.findByIdAndUpdate(_id, { $inc: incrementObject });
  }
  async updateMissionList(_id, newMission) {
    const {
      postCount,
      reviewCount,
      missionClear,
      bingoCount,
      continuousConnection,
    } = newMission;
    const updatedMission = await Mission.findByIdAndUpdate(
      _id,
      {
        postCount,
        reviewCount,
        missionClear,
        bingoCount,
        continuousConnection,
      },
      { new: true }
    );
    return updatedMission;
  }
  async resetMission(_id) {
    await User.findByIdAndUpdate({ _id }, { loginDate: [] });
    const resetMission = await Mission.findByIdAndUpdate(_id, {
      postCount: 0,
      reviewCount: 0,
      missionClear: 0,
      bingoCount: 0,
      continuousConnection: 1,
    });
    return resetMission;
  }
  async resetBingo(_id) {
    const bingo = shuffle(BINGO_AREA);
    const resetBingo = await Bingo.findByIdAndUpdate(_id, {
      bingo,
    });
    return resetBingo;
  }
}
module.exports = new BingoService();
