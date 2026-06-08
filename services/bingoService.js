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
    await Bingo.create({ _id, bingo });
  }
  async createMission(_id, postCount, reviewCount, missionClear, bingoCount, continuousConnection) {
    await Mission.create({ _id, postCount, reviewCount, missionClear, bingoCount, continuousConnection });
  }
  async getUserBingo(id) {
    return await Bingo.findById(id);
  }
  async getMission(id) {
    return await Mission.findById(id);
  }
  async getReviewCount(id) {
    const mission = await Mission.findById(id);
    return mission ? mission.reviewCount : 0;
  }
  async getPostCount(id) {
    const mission = await Mission.findById(id);
    return mission ? mission.postCount : 0;
  }
  async getMissionClear(id) {
    const bingo = await Bingo.findById(id);
    if (!bingo) return 0;
    return missionClearCounter(bingo.bingo);
  }
  async getBingoCount(id) {
    const bingo = await Bingo.findById(id);
    if (!bingo) return 0;
    return bingoRule(bingo.bingo).count;
  }
  async getContinuousConnection(user) {
    const loginDate = user ? user.loginDate : null;
    return loginDate ? consecutiveVisitDays(loginDate) : 1;
  }
  async getBingoPattern(id) {
    const bingo = await Bingo.findById(id);
    if (!bingo) return [];
    return bingoRule(bingo.bingo).bingoPattern;
  }
  async updateBingo(id, updatedBingo) {
    return await Bingo.findByIdAndUpdate(id, { $set: updatedBingo });
  }
  async countIncMission(_id, targetArea) {
    return await Mission.findByIdAndUpdate(_id, { $inc: { [targetArea]: 1 } });
  }
  async updateMissionList(_id, newMission) {
    const { postCount, reviewCount, missionClear, bingoCount, continuousConnection } = newMission;
    return await Mission.findByIdAndUpdate(
      _id,
      { postCount, reviewCount, missionClear, bingoCount, continuousConnection },
      { new: true }
    );
  }
  async resetMission(_id) {
    await User.findByIdAndUpdate(_id, { loginDate: [] });
    return await Mission.findByIdAndUpdate(_id, {
      postCount: 0,
      reviewCount: 0,
      missionClear: 0,
      bingoCount: 0,
      continuousConnection: 1,
    });
  }
  async resetBingo(_id) {
    const bingo = shuffle(BINGO_AREA);
    return await Bingo.findByIdAndUpdate(_id, { bingo });
  }
}
module.exports = new BingoService();
