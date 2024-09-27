const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  publicId: {
    type: String,
  },
  url: {
    type: String,
  },
});

const blogPostSchema = new Schema(
  {
    author: {
      type: String,
      require: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    blogPostTitle: {
      type: String,
      require: true,
    },
    blogPostDesc: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    campSiteName: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [imageSchema],
    },
    backgroundImgUrls: {
      type: [imageSchema],
    },
  },
  {
    timestamps: true,
  }
);

const BlogPost = model("BlogPost", blogPostSchema);

module.exports = BlogPost;
