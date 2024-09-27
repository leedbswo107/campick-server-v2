const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  publicId: {
    type: String,
  },
  url: {
    type: String,
  },
});

const salePostSchema = new Schema(
  {
    author: {
      type: String,
      ref: "User",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      require: true,
    },
    isNegotiable: {
      type: Boolean,
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    productName: {
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
    condition: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [imageSchema],
    },
    salesStatus: {
      type: String,
      enum: ["판매중", "예약중", "거래완료"],
      default: "selling",
    },
  },
  {
    timestamps: true,
  }
);

const SalePost = model("SalePost", salePostSchema);

module.exports = SalePost;
