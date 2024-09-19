import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { renameSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (name, userId) => {
  return jwt.sign({ name, userId }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const signup = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.create({
      name,
      password,
      profileSetup: false,
      nickname: "",
      image: "",
      color: "",
    });
    res.cookie("jwt", createToken(name, user._id), {
      maxAge,

    });
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.cookie("jwt", createToken(name, user._id), {
      maxAge,

    });
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      id: userData._id,
      name: userData.name,
      profileSetup: userData.profileSetup,
      image: userData.image,
      color: userData.color,
      nickname: userData.nickname,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const { userId } = req;
    const { nickname, color } = req.body;
    if (!nickname || !color) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        nickname,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      id: userData._id,
      name: userData.name,
      profileSetup: userData.profileSetup,
      nickname: userData.nickname,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      const date = new Date();
      const { userId } = req;
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const avatarUrl = `/uploads/profile/${date.getTime()}${path.extname(
        req.file.originalname
      )}`;
      renameSync(
        req.file.path,
        `uploads/profile/${date.getTime()}${path.extname(
          req.file.originalname
        )}`
      );
      const userData = await User.findByIdAndUpdate(
        userId,
        { image: avatarUrl },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        image: userData.image,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
