const Bingo = require("../models/Bingo");
const Mission = require("../models/Mission");
const Post = require("../models/Post");
const Review = require("../models/Review");
const User = require("../models/User");
const { encrypt } = require("../utils/encrypt");
const { compareSync } = require("bcryptjs");

class UserService {
  async createUser(username, password, nickname) {
    try {
      const tr = await User.create({
        username,
        password,
        nickname,
      });
      return tr;
    } catch (error) {
      console.error(error);
    }
  }
  async getUserByUserName(username) {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      console.error(error);
    }
  }
  async getUserById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteUser(userObjId) {
    try {
      await Bingo.findByIdAndDelete(userObjId);
      await Mission.findByIdAndDelete(userObjId);
      await Post.findByIdAndDelete(userObjId);
      await Review.findByIdAndDelete(userObjId);
      await User.findByIdAndDelete(userObjId);
      return { result: true, message: "User successfully deleted" };
    } catch (error) {
      console.error(error);
    }
  }
  async loginDateInfoUpdate(id, loginDate) {
    try {
      await User.findByIdAndUpdate(id, { $push: { loginDate } });
    } catch (error) {
      console.error(error);
    }
  }
  async duplicateNickname(nickname) {
    try {
      const nicknameCheck = await User.findOne({ nickname });
      if (nicknameCheck) throw new Error("Nickname already exists");
      return { message: "Can use this nickname" };
    } catch (error) {
      console.error(error);
    }
  }
  async updateUserData(userObjId, nickname, password) {
    try {
      const hashedPassword = encrypt(password);
      await User.findByIdAndUpdate(
        userObjId,
        { nickname, password: hashedPassword },
        { new: true }
      );
      return { result: true };
    } catch (error) {
      console.error(error);
    }
  }
  async passwordCheck(id, password) {
    try {
      const user = await User.findById(id);
      const validPassword = compareSync(password, user.password);
      if (validPassword) return true;
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = new UserService();
