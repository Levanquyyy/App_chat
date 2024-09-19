import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    const validMember = await User.find({ _id: { $in: members } });
    if (validMember.length !== members.length) {
      return res.status(404).json({ message: "Member not found" });
    }
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();
    res.status(201).json({ channel: newChannel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updateAt: -1 });
    res.status(200).json({ channels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChannelMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: { path: "sender", select: "id name nickname image color" },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const messages = channel.messages;
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
