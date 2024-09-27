const fs = require("fs");
const { cloudinaryUpload } = require("../utils/fileUpload.js");
const { deleteUploadedImages } = require("../utils/deleteUploadedImages.js");

const {
  getSalePostByTarget,
  deleteSalePostById,
  getSalePost,
  createNewSalePost,
} = require("../services/salePostService.js");

const getSalePosts = async (req, res) => {
  const { category, keyword } = req.query;

  if (category) {
    try {
      const salePosts = await getSalePostByTarget("category", category);
      if (salePosts.length === 0) {
        return res.status(200).json({ result: true, salePosts: [] });
      }
      return res.status(200).json({ result: true, salePosts });
    } catch (error) {
      return res.status(500).json({
        result: false,
        message: "잠시후 다시 시도해주세요.",
      });
    }
  }

  if (keyword) {
    // 키워드 일부를 포함
    const regex = new RegExp(keyword, "i");

    try {
      // 키워드가 포함된 데이터를 find
      const salePosts = await getSalePostByTarget("productName", regex);
      if (salePosts.length === 0) {
        return res.status(200).json({ result: true, salePosts: [] });
      }

      return res.status(200).json({ result: true, salePosts });
    } catch (error) {
      return res.status(500).json({
        result: false,
        message: "잠시후 다시 시도해주세요.",
      });
    }
  }

  try {
    const salePosts = await getSalePostByTarget();
    return res.status(200).json({ result: true, salePosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 조회에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const getSalePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const salePost = await getSalePost(id);
    if (!salePost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    return res.status(200).json({ result: true, salePost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 조회에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const createSalePost = async (req, res) => {
  const imageUrls = [];
  for (const file of req.files) {
    const imageUrl = await cloudinaryUpload(file);
    imageUrls.push(imageUrl);
    // uploads/images 폴더에 임시로 저장된 이미지 파일 삭제
    fs.unlinkSync(file.path);
  }

  const newPost = JSON.parse(req.body.newPost);

  const { nickname, _id } = req.user;
  try {
    const salePost = await createNewSalePost(
      newPost,
      newPost.city,
      imageUrls,
      nickname,
      _id
    );
    return res.status(201).json({ result: true, salePost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 생성에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const updateSalePost = async (req, res) => {
  const { id } = req.params;
  const {
    category,
    productName,
    region,
    city,
    price,
    desc,
    condition,
    isNegotiable,
    salesStatus,
  } = req.body;

  try {
    const salePost = await getSalePost(id);
    if (!salePost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }

    salePost.category = category;
    salePost.price = price;
    salePost.desc = desc;
    salePost.productName = productName;
    salePost.region = region;
    salePost.city = city;
    salePost.condition = condition;
    salePost.isNegotiable = isNegotiable;
    salePost.salesStatus = salesStatus;

    await salePost.save();
    return res.status(200).json({ result: true, salePost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 수정에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const deleteSalePost = async (req, res) => {
  const { id } = req.params;

  try {
    const salePost = await getSalePost(id);
    if (!salePost) {
      return res
        .status(404)
        .json({ result: false, message: "게시물이 존재하지 않습니다." });
    }
    // 업로드된 이미지 파일 cloudinary에서 삭제
    const { imageUrls } = salePost;
    deleteUploadedImages(imageUrls);
    await deleteSalePostById(id);

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
  getSalePosts,
  getSalePostById,
  createSalePost,
  updateSalePost,
  deleteSalePost,
};
