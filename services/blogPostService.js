const BlogPost = require("../models/blogPostModel");

class BlogPostService {
  async getAllBlogPosts() {
    try {
      const posts = await BlogPost.find().sort({ createdAt: -1 });
      return posts;
    } catch (error) {
      console.error(error);
    }
  }
  async getBlogPostByAuthorId(authorId) {
    try {
      const posts = await BlogPost.find({ authorId });
      return posts;
    } catch (error) {
      console.error(error);
    }
  }
  async getBlogPost(id) {
    try {
      const post = await BlogPost.findById(id);
      return post;
    } catch (error) {
      console.error(error);
    }
  }
  async newBlogPost(newPostData, backgroundImgUrls, author, authorId) {
    const blogPost = new BlogPost({
      ...newPostData,
      _city: newPostData.city ?? " ",
      get city() {
        return this._city;
      },
      set city(value) {
        this._city = value;
      },
      backgroundImgUrls,
      author,
      authorId,
    });

    await blogPost.save();
    return blogPost;
  }
  async deleteBlogPostById(id) {
    try {
      return await BlogPost.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = new BlogPostService();
