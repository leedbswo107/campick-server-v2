const SalePost = require("../models/salePostModel");

class SalePostService {
  async getSalePostById(authorId) {
    try {
      return await SalePost.find({ authorId });
    } catch (error) {
      console.error(error);
    }
  }
  async getSalePostByTarget(targetArea = null, targetValue = null) {
    try {
      console.log("targetArea", targetArea);
      console.log("targetValue", targetValue);

      if (targetArea && targetValue) {
        const targetObject = {};
        targetObject[targetArea] = targetValue;
        console.log("targetObject", targetObject);
        const salePosts = await SalePost.find(targetObject).sort({
          createdAt: -1,
        });
        return salePosts;
      } else {
        const salePosts = await SalePost.find({}).sort({ createdAt: -1 });
        return salePosts;
      }
    } catch (error) {
      console.error(error);
    }
  }
  async deleteSalePostById(id) {
    try {
      await SalePost.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
    }
  }
  async getSalePost(id) {
    try {
      const salePost = await SalePost.findById(id);
      return salePost;
    } catch (error) {
      console.error(error);
    }
  }
  async createNewSalePost(newPost, city, imageUrls, author, authorId) {
    try {
      const salePost = new SalePost({
        ...newPost,
        city: city ?? " ",
        imageUrls: [...imageUrls],
        salesStatus: "판매중",
        author,
        authorId,
      });
      await salePost.save();
      return salePost;
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = new SalePostService();
