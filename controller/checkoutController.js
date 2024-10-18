const {
  getOrderById,
  createNewCheckout,
} = require("../services/checkoutService.js");

const getCheckoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const checkout = await getOrderById(id);
    if (!checkout) {
      return res
        .status(404)
        .json({ result: false, message: "주문이 존재하지 않습니다." });
    }

    return res.status(200).json({ result: true, checkout });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "주문을 불러오는데 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

const createCheckout = async (req, res) => {
  try {
    const checkout = await createNewCheckout(req.body.salePostId, req.user._id);
    return res.status(201).json({ result: true, checkout });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      result: false,
      message: "게시물 생성에 실패했습니다. 잠시후 다시 시도해주세요.",
    });
  }
};

module.exports = {
  getCheckoutById,
  createCheckout,
};
