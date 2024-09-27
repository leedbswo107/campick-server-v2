const { Router } = require("express");
const {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require("../controller/messageController.js");

const { checkAuth } = require("../middleware/checkAuth.js");

const router = Router();

router.post("/create", checkAuth, createConversation);
router.get("/", checkAuth, getConversations);
router.get("/:id", checkAuth, getMessages);
router.post("/send/:id", checkAuth, sendMessage);

module.exports = router;
