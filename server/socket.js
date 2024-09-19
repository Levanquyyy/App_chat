import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const disconnect = (socket) => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(
          `user disconnected: ${userId} with socket id: ${socket.id}`
        );
        break;
      }
    }
  };
  const sendMessage = async (message) => {
    // Lấy socket ID của người gửi từ userSocketMap dựa trên ID người gửi trong tin nhắn
    const senderSocketId = userSocketMap.get(message.sender);
    // Lấy socket ID của người nhận từ userSocketMap dựa trên ID người nhận trong tin nhắn
    const receiverSocketId = userSocketMap.get(message.receiver);
    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id name nickname image color")
      .populate("receiver", "id name nickname image color");
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };
  const sendChannelMessage = async (message) => {
    const { sender, content, messageType, fileUrl, channelId } = message;

    const createdMessage = await Message.create({
      sender,
      content,
      messageType,
      fileUrl,
      timeStamp: new Date(),
      fileUrl,
    });
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id name nickname image color")
      .exec();
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });
    const channel = await Channel.findById(channelId).populate("members");
    const finalData = { ...messageData._doc, channelId: channel._id };
    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
    }
  };
  const userSocketMap = new Map();
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected: ${userId} with socket id: ${socket.id}`);
    } else {
      console.log("user id is required");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-message-channel", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};
export default setupSocket;
