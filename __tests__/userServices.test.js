require("./setup");
const userService = require("../services/userServices");
const { encrypt } = require("../utils/encrypt");

describe("UserService", () => {
  describe("createUser", () => {
    it("유저를 생성하고 반환한다", async () => {
      const user = await userService.createUser("test@test.com", "password123", "tester");
      expect(user.username).toBe("test@test.com");
      expect(user.nickname).toBe("tester");
      expect(user._id).toBeDefined();
    });
  });

  describe("getUserByUserName", () => {
    it("존재하는 username으로 유저를 찾는다", async () => {
      await userService.createUser("find@test.com", "pw", "finder");
      const user = await userService.getUserByUserName("find@test.com");
      expect(user).not.toBeNull();
      expect(user.username).toBe("find@test.com");
    });

    it("존재하지 않는 username은 null을 반환한다", async () => {
      const user = await userService.getUserByUserName("nobody@test.com");
      expect(user).toBeNull();
    });
  });

  describe("getUserById", () => {
    it("존재하는 id로 유저를 찾는다", async () => {
      const created = await userService.createUser("id@test.com", "pw", "iduser");
      const user = await userService.getUserById(created._id);
      expect(user).not.toBeNull();
      expect(user.username).toBe("id@test.com");
    });
  });

  describe("duplicateEmailCheck", () => {
    it("이미 존재하는 이메일은 true를 반환한다", async () => {
      await userService.createUser("dup@test.com", "pw", "dupuser");
      const result = await userService.duplicateEmailCheck("dup@test.com");
      expect(result).toBe(true);
    });

    it("존재하지 않는 이메일은 false를 반환한다", async () => {
      const result = await userService.duplicateEmailCheck("new@test.com");
      expect(result).toBe(false);
    });
  });

  describe("duplicateNickname", () => {
    it("사용 가능한 닉네임은 성공 메시지를 반환한다", async () => {
      const result = await userService.duplicateNickname("유니크닉네임");
      expect(result.message).toBe("Can use this nickname");
    });

    it("이미 존재하는 닉네임은 에러를 throw한다", async () => {
      await userService.createUser("nick@test.com", "pw", "중복닉네임");
      await expect(userService.duplicateNickname("중복닉네임")).rejects.toThrow(
        "Nickname already exists"
      );
    });
  });

  describe("passwordCheck", () => {
    it("올바른 비밀번호는 true를 반환한다", async () => {
      const hashed = encrypt("correctPW");
      const user = await userService.createUser("pw@test.com", hashed, "pwuser");
      const result = await userService.passwordCheck(user._id, "correctPW");
      expect(result).toBe(true);
    });

    it("잘못된 비밀번호는 false를 반환한다", async () => {
      const hashed = encrypt("correctPW");
      const user = await userService.createUser("pw2@test.com", hashed, "pwuser2");
      const result = await userService.passwordCheck(user._id, "wrongPW");
      expect(result).toBe(false);
    });
  });

  describe("loginDateInfoUpdate", () => {
    it("loginDate 배열에 날짜를 추가한다", async () => {
      const user = await userService.createUser("login@test.com", "pw", "loginuser");
      const date = new Date().toISOString();
      await userService.loginDateInfoUpdate(user._id, date);
      const updated = await userService.getUserById(user._id);
      expect(updated.loginDate).toContain(date);
    });
  });

  describe("deleteUser", () => {
    it("유저를 삭제하고 결과를 반환한다", async () => {
      const user = await userService.createUser("del@test.com", "pw", "deluser");
      const result = await userService.deleteUser(user._id);
      expect(result.result).toBe(true);
      const deleted = await userService.getUserById(user._id);
      expect(deleted).toBeNull();
    });
  });
});
