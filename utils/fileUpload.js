const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limits: { fileSize: 20 * 1024 * 1024 },
  storage: multer.diskStorage({
    // uploads/images 폴더에 이미지 파일 임시 저장
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    // 파일명 중복을 피하기 위해 uuid를 사용하여 파일명 생성
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
});

const cloudinaryUpload = async (file) => {
  // uploads/images 폴더에 임시로 저장된 이미지 파일을 cloudinary에 업로드
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });

    const imageUrl = { publicId: result.public_id, url: result.secure_url };
    // cloudinary에 업로드된 이미지 파일의 url을 반환
    return imageUrl;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { fileUpload, cloudinaryUpload };
