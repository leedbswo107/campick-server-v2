const Coupon = require("../models/Coupon");
const { getDateNdays } = require("../utils/getDateNDays");
const { serialNumGenerator } = require("../utils/serialNumGenerator");

class CouponService {
  async getCoupons(id) {
    return await Coupon.find({ owner: id });
  }
  async availableCoupons(id, coupon) {
    return await Coupon.findById(id).findOne({
      condition: coupon.CONDITION,
      status: "active",
    });
  }
  async createCoupon(ownerId, coupon) {
    const serialNum = await serialNumGenerator();
    await Coupon.create({
      owner: ownerId,
      date: coupon.DATE,
      condition: coupon.CONDITION,
      type: coupon.TYPE,
      serialNum,
      status: "active",
      activeDate: new Date().toISOString(),
      expireDate: await getDateNdays(new Date(), coupon.DATE),
    });
  }
  async removeCoupon(id) {
    return await Coupon.findByIdAndDelete(id);
  }
  async expiredCoupon(id) {
    return await Coupon.findByIdAndUpdate(id, { status: "expired" });
  }
  async checkAndExpireCoupons() {
    try {
      const now = new Date();
      const activeCoupons = await Coupon.find({ status: "active" });
      for (let coupon of activeCoupons) {
        const expirationDate = new Date(coupon.activeDate);
        expirationDate.setDate(expirationDate.getDate() + coupon.date);
        if (now > expirationDate) {
          coupon.status = "expired";
          await coupon.save();
          console.log(`Coupon ${coupon.serialNum} has expired.`);
        }
      }
    } catch (error) {
      console.error("Error checking and expiring coupons:", error);
    }
  }
}
module.exports = new CouponService();
