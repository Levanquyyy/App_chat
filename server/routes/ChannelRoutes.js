import { Router } from "express";
import { verifyToken } from "../middlewares/Authmiddleware.js";
import {
  createChannel,
  getChannelMessage,
  getChannels,
} from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-channels", verifyToken, getChannels);
channelRoutes.get(
  "/get-channel-message/:channelId",
  verifyToken,
  getChannelMessage
);
export default channelRoutes;
