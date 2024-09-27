const User = require("../models/User.js");
const Conversation = require("../models/conversationModel.js");
const Message = require("../models/messageModel.js");
const { getReceiverSocketId, io } = require("../utils/socket.js");

const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    // 대화의 참여자로 보낸이와 받는이를 추가
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // 존재하는 대화가 없을 경우 새로운 대화 생성
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });

      await conversation.save();

      return res.status(201).json({ result: true, conversation });
    }

    res.status(200).json({ result: true, conversation });
  } catch (error) {
    console.log("Error in createConversation controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getConversations = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const con = await Conversation.find({
      participants: loggedInUserId,
    });

    con.forEach((el) => console.log(el.participants));

    const myConversations = await Conversation.find({
      participants: loggedInUserId,
    })
      .populate({
        path: "participants",
        select: "-password", // password 필드를 제외
      })
      .sort({ updatedAt: -1 });

    console.log(myConversations);
    // console.log("loggedInUserId", loggedInUserId);
    const filteredChats = myConversations.map((chat) => {
      // console.log(chat.participants);
      chat.participants = chat.participants.filter(
        (participant) => !participant._id.equals(loggedInUserId)
      );
      return chat;
    });

    // console.log("filteredChats", filteredChats);

    // 왼쪽 채팅창에 보여주기 위해서 로그인한 유저(나)를 제외한 나머지 유저들의 정보를 반환
    // const filteredUsers = await User.find({
    //   _id: { $ne: loggedInUserId },
    // }).select("-password");

    res.status(200).json({ result: true, filteredChats });
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // 대화의 참여자로 보낸이와 받는이를 추가
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // 존재하는 대화가 없을 경우 새로운 대화 생성
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // 대화와 메시지 동시에 저장
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);

    // 소켓으로 수신자에게 알림 전송
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ result: true, newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // 보낸이와 받는이 모두가 포함된 대화를 찾아서
    // populate로 실제 메시지들을 불러옴
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation)
      return res.status(200).json({ result: true, messages: [] });

    const messages = conversation.messages;

    res.status(200).json({ result: true, messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
};
