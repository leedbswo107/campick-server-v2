const cron = require("node-cron");
const { checkAndExpireCoupons } = require("../services/couponService");

const scheduleCouponExpirationCheck = () => {
  cron.schedule("0 0 * * *", () => {
    console.log("Running daily coupon expiration check");
    checkAndExpireCoupons();
  });
};

module.exports = {
  scheduleCouponExpirationCheck,
};
