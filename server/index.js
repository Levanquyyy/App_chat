import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import path from "path";
import fs from "fs";
import ContactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8800;
const DATABASE_URL = process.env.DATABASE_URL;

// ... các middleware khác ...

// Thêm middleware để phục vụ các file tĩnh
app.use("uploads/files", express.static("uploads/files"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/contacts", ContactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setupSocket(server);

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Tạo thư mục uploads/profile nếu chưa tồn tại
const uploadDir = path.join(process.cwd(), "uploads", "profile");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
