import { useRef, useState, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { UPLOAD_FILE } from "@/utilites/constant";
const MessageBar = () => {
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const socket = useSocket();
  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        receiver: selectedChatData._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-message-channel", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
      setMessage("");
    }
  };

  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        if (res.status === 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              receiver: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              // file: res.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-message-channel", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
      console.log({ file });
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  };

  return (
    <div className="h-[10vh] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 relative">
        <input
          className="w-full p-5 pr-24 rounded-md focus:border-none focus:outline-none
                     bg-gray-100 dark:bg-gray-800 
                     text-gray-800 dark:text-gray-200
                     placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="absolute right-12 top-1/2 transform -translate-y-1/2
                     text-neutral-500 focus:border-none focus:outline-none 
                     hover:text-neutral-700 dark:hover:text-neutral-300
                     duration-300 transition-all"
          onClick={handleAttachFile}
        >
          <GrAttachment className="text-3xl" />
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAttachFileChange}
          />
        </button>

        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2
             text-neutral-500 focus:border-none focus:outline-none 
             hover:text-neutral-700 dark:hover:text-neutral-300
             duration-300 transition-all"
          onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
        >
          <RiEmojiStickerLine className="text-3xl" />
        </button>

        {emojiPickerOpen && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full right-0 mb-2"
            style={{ zIndex: 1000 }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
      <button
        className="text-white focus:border-none focus:outline-none 
                   hover:text-white dark:hover:text-white hover:scale-110
                   duration-300 transition-all bg-blue-500 p-3 rounded-lg"
        onClick={handleSendMessage}
      >
        <IoSend className="text-3xl" />
      </button>
    </div>
  );
};

export default MessageBar;
