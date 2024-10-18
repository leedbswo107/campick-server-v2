const { Schema, model } = require("mongoose");

const checkoutSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Checkout = model("Checkout", checkoutSchema);

module.exports = Checkout;
