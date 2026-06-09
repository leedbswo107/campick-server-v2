require("./setup");
const mongoose = require("mongoose");
const bingoService = require("../services/bingoService");
const userService = require("../services/userServices");

const mockBingoArea = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  area: `area${i + 1}`,
  checked: false,
}));

describe("BingoService", () => {
  let userId;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId();
  });

  describe("createBingo / getUserBingo", () => {
    it("빙고를 생성하고 조회한다", async () => {
      await bingoService.createBingo(userId, mockBingoArea);
      const bingo = await bingoService.getUserBingo(userId);
      expect(bingo).not.toBeNull();
      expect(bingo.bingo).toHaveLength(25);
    });
  });

  describe("createMission / getMission", () => {
    it("미션을 생성하고 조회한다", async () => {
      await bingoService.createMission(userId, 0, 0, 0, 0, 1);
      const mission = await bingoService.getMission(userId);
      expect(mission).not.toBeNull();
      expect(mission.postCount).toBe(0);
      expect(mission.continuousConnection).toBe(1);
    });
  });

  describe("getPostCount / getReviewCount", () => {
    it("미션이 없으면 0을 반환한다", async () => {
      const nonExistId = new mongoose.Types.ObjectId();
      expect(await bingoService.getPostCount(nonExistId)).toBe(0);
      expect(await bingoService.getReviewCount(nonExistId)).toBe(0);
    });

    it("미션이 있으면 해당 카운트를 반환한다", async () => {
      await bingoService.createMission(userId, 3, 5, 0, 0, 1);
      expect(await bingoService.getPostCount(userId)).toBe(3);
      expect(await bingoService.getReviewCount(userId)).toBe(5);
    });
  });

  describe("getMissionClear / getBingoCount / getBingoPattern", () => {
    it("빙고가 없으면 기본값을 반환한다", async () => {
      const nonExistId = new mongoose.Types.ObjectId();
      expect(await bingoService.getMissionClear(nonExistId)).toBe(0);
      expect(await bingoService.getBingoCount(nonExistId)).toBe(0);
      expect(await bingoService.getBingoPattern(nonExistId)).toEqual([]);
    });
  });

  describe("countIncMission", () => {
    it("지정한 필드를 1 증가시킨다", async () => {
      await bingoService.createMission(userId, 0, 0, 0, 0, 1);
      await bingoService.countIncMission(userId, "postCount");
      await bingoService.countIncMission(userId, "postCount");
      const mission = await bingoService.getMission(userId);
      expect(mission.postCount).toBe(2);
    });
  });

  describe("updateMissionList", () => {
    it("미션 데이터를 업데이트한다", async () => {
      await bingoService.createMission(userId, 0, 0, 0, 0, 1);
      const newMission = { postCount: 5, reviewCount: 3, missionClear: 2, bingoCount: 1, continuousConnection: 7 };
      await bingoService.updateMissionList(userId, newMission);
      const mission = await bingoService.getMission(userId);
      expect(mission.postCount).toBe(5);
      expect(mission.reviewCount).toBe(3);
      expect(mission.continuousConnection).toBe(7);
    });
  });

  describe("resetMission", () => {
    it("미션을 초기값으로 리셋한다", async () => {
      const user = await userService.createUser("reset@test.com", "pw", "resetuser");
      await bingoService.createMission(user._id, 10, 5, 3, 2, 7);
      await bingoService.resetMission(user._id);
      const mission = await bingoService.getMission(user._id);
      expect(mission.postCount).toBe(0);
      expect(mission.reviewCount).toBe(0);
      expect(mission.continuousConnection).toBe(1);
    });
  });

  describe("getContinuousConnection", () => {
    it("user가 null이면 1을 반환한다", async () => {
      const result = await bingoService.getContinuousConnection(null);
      expect(result).toBe(1);
    });

    it("loginDate가 없으면 1을 반환한다", async () => {
      const result = await bingoService.getContinuousConnection({ loginDate: null });
      expect(result).toBe(1);
    });
  });
});
