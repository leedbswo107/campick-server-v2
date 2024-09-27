const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true,
  },
});
postSchema.set("timestamps", true);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
