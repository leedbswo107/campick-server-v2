const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
});
inquirySchema.set("timestamps", true);
const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
