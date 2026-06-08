const Bingo = require("../models/Bingo");
const Mission = require("../models/Mission");
const Post = require("../models/Post");
const Review = require("../models/Review");
const User = require("../models/User");
const Blog = require("../models/blogPostModel");
const SalePost = require("../models/salePostModel");
const { encrypt } = require("../utils/encrypt");
const { compareSync } = require("bcryptjs");

class UserService {
  async createUser(username, password, nickname) {
    return await User.create({ username, password, nickname });
  }
  async getUserByUserName(username) {
    return await User.findOne({ username });
  }
  async getUserById(id) {
    return await User.findById(id);
  }
  async deleteUser(userObjId) {
    await Bingo.findByIdAndDelete(userObjId);
    await Mission.findByIdAndDelete(userObjId);
    await Post.findByIdAndDelete(userObjId);
    await Review.findOneAndDelete({ author: userObjId });
    await Blog.findOneAndDelete({ authorId: userObjId });
    await SalePost.findOneAndDelete({ authorId: userObjId });
    await User.findByIdAndDelete(userObjId);
    return { result: true, message: "User successfully deleted" };
  }
  async loginDateInfoUpdate(id, loginDate) {
    await User.findByIdAndUpdate(id, { $push: { loginDate } });
  }
  async duplicateEmailCheck(email) {
    const emailCheck = await User.findOne({ username: email });
    return !!emailCheck;
  }
  async duplicateNickname(nickname) {
    const nicknameCheck = await User.findOne({ nickname });
    if (nicknameCheck) throw new Error("Nickname already exists");
    return { message: "Can use this nickname" };
  }
  async updateUserData(userObjId, nickname, password) {
    const hashedPassword = encrypt(password);
    await User.findByIdAndUpdate(
      userObjId,
      { nickname, password: hashedPassword },
      { new: true }
    );
    return { result: true };
  }
  async passwordCheck(id, password) {
    const user = await User.findById(id);
    return compareSync(password, user.password);
  }
}
module.exports = new UserService();
