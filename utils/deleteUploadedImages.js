const cloudinary = require("cloudinary").v2;

// 업로드된 이미지 파일 cloudinary에서 삭제
const deleteUploadedImages = async (imageUrls) => {
  try {
    const publicIds = imageUrls.map((image) => image.publicId);
    await cloudinary.api.delete_resources(publicIds, function (error, result) {
      console.log("cloudinary delete resources console", result, error);
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { deleteUploadedImages };
