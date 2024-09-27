const Inquiry = require("../models/Inquiry");

class InquiryService {
  async createInquiry(title, email, content) {
    return await Inquiry.create({ title, email, content });
  }
}
module.exports = new InquiryService();
