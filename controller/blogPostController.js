const fs = require("fs");
const { cloudinaryUpload } = require("../utils/fileUpload.js");
const { deleteUploadedImages } = require("../utils/deleteUploadedImages.js");
const {
  getAllBlogPosts,
  getBlogPost,
  newBlogPost,
  deleteBlogPostById,
} = require("../services/blogPostService.js");
const { countIncMission } = require("../services/bingoService.js");
//이미지 업로드
const uploadImages = async (req, res) => {
  try {
    const imageUrls = [];
    for (const file of req.files) {
      const imageUrl = await cloudinaryUpload(file);
      imageUrls.push(imageUrl);
      fs.unlinkSync(file.path);
    }

    return res.status(200).json({ result: true, imageUrls });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "이미지 업로드에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};
console.log(uploadImages);
const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await getAllBlogPosts();
    if (blogPosts.length === 0) {
      return res.status(200).json({ result: true, blogPosts: [] });
    }
    return res.status(200).json({ result: true, blogPosts });
  } catch (error) {
    return res.status(500).json({
      result: false,
      message: "잠시후 다시 시도해주세요.",
    });
  }
};

const getBlogPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await getBlogPost(id);
    if (!blogPost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    return res.status(200).json({ result: true, blogPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 조회에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const createBlogPost = async (req, res) => {
  const backgroundImgUrls = [];
  for (const file of req.files) {
    const imageUrl = await cloudinaryUpload(file);
    backgroundImgUrls.push(imageUrl);
    // uploads/images 폴더에 임시로 저장된 이미지 파일 삭제
    fs.unlinkSync(file.path);
  }
  const newPost = JSON.parse(req.body.newPost);
  const { nickname, _id } = req.user;

  await countIncMission(_id, "postCount");

  try {
    const blogPost = await newBlogPost(
      newPost,
      backgroundImgUrls,
      nickname,
      _id
    );
    return res.status(201).json({ result: true, blogPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 생성에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const {
    blogPostTitle,
    content,
    region,
    city,
    campSiteName,
    blogPostDesc,
    imageUrls,
  } = req.body;

  try {
    const blogPost = await getBlogPost(id);
    if (!blogPost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    blogPost.blogPostTitle = blogPostTitle;
    blogPost.content = content;
    blogPost.region = region;
    blogPost.city = city;
    blogPost.campSiteName = campSiteName;
    blogPost.blogPostDesc = blogPostDesc;
    blogPost.imageUrls = imageUrls;

    await blogPost.save();
    return res.status(200).json({ result: true, blogPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 수정에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const deleteBlogPost = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await getBlogPost(id);
    if (!blogPost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    const { imageUrls, backgroundImgUrls } = blogPost;
    deleteUploadedImages([...imageUrls, ...backgroundImgUrls]);

    await deleteBlogPostById(id);

    return res
      .status(200)
      .json({ result: true, message: "게시물이 삭제되었습니다." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 삭제에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

module.exports = {
  uploadImages,
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
