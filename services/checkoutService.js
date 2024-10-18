const Checkout = require("../models/checkoutModel");
const SalePost = require("../models/salePostModel");

class CheckoutService {
  async getOrderById(checkoutId) {
    try {
      return await Checkout.findById(checkoutId);
    } catch (error) {
      console.error(error);
    }
  }
  async createNewCheckout(salePostId, buyerId) {
    try {
      const saleItem = await SalePost.findById(salePostId).populate({
        path: "price",
      });

      const newCheckout = new Checkout({
        price: saleItem.price,
        buyerId,
      });
      await newCheckout.save();
      return newCheckout;
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = new CheckoutService();
