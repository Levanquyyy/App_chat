import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useAppStore } from "@/store";
import apiClient from "@/lib/api-client";
import { GET_All_MESSAGES } from "@/utilites/constant";
import { HOST } from "@/utilites/constant";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import useDownloader from "react-use-downloader";
import { GET_CHANNEL_MESSAGE } from "@/utilites/constant";

const MessageContainer = () => {
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
  const scrollRef = useRef();
  const {
    selectedChatMessages,
    selectedChatData,
    selectedChatType,
    userInfo,
    setSelectedChatMessages,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentDownloadingFile, setCurrentDownloadingFile] = useState(null); // Trạng thái file đang tải xuống

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const handleDownload = (fileUrl) => {
    if (currentDownloadingFile) return; // Ngăn không cho tải xuống nếu đang tải file khác
    setCurrentDownloadingFile(fileUrl); // Đặt file đang tải xuống
    const fullUrl = `${HOST}/${fileUrl}`;
    download(fullUrl, fileUrl.split("/").pop())
      .then(() => {
        setCurrentDownloadingFile(null); // Đặt lại trạng thái khi tải xong
      })
      .catch(() => {
        setCurrentDownloadingFile(null); // Đặt lại trạng thái nếu có lỗi
      });
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_All_MESSAGES,
          {
            id: selectedChatData._id,
          },
          {
            withCredentials: true,
          }
        );

        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getChannelMessage = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGE}/${selectedChatData._id}`,

          {
            withCredentials: true,
          }
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessage();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null; // Initialize lastDate
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}{" "}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender !== selectedChatData._id ? "text-right " : "text-left"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#1a37ef] border-[#8417ff]/50 rounded-xl text-white"
              : "bg-[#8417ff] border-[#ffffff]/20 rounded-xl text-white "
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "text-white "
              : "text-white "
          } border inline-block p-4 my-1 max-w-[50%] break-words `}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                alt="file"
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="p-3 text-2xl rounded-full cursor-pointer transition-all duration-300"
                onClick={() => handleDownload(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-sx text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  );
  const renderChannelMessages = (message) => {
    return (
      // Thêm return để sử dụng toán tử 3 ngôi
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" ? ( // Sử dụng toán tử 3 ngôi
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#1a37ef] border-[#8417ff]/50 rounded-xl text-white "
                : "bg-[#8417ff] border-[#ffffff]/20 rounded-xl text-white"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        ) : null}
        {message.sender._id !== userInfo.id ? ( // Sử dụng toán tử 3 ngôi
          <div className="flex items-center justify-start gap-3 ">
            <div className="w-8 h-8">
              {message.sender.image ? (
                <img
                  src={`${HOST}${message.sender.image}`}
                  alt="Avatar preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <p className="text-2xl dark:bg-white dark:text-black rounded-full p-2 h-full flex justify-center items-center bg-black text-white">
                  {getInitials(message.sender.name)}
                </p>
              )}
            </div>

            <span className="text-sm">{`${message.sender.nickname}`}</span>
            <span className="text-sm">
              {moment(message.timeStamp).format("LT")}
            </span>
          </div>
        ) : // <span className="text-sm mt-1">
        //   {moment(message.timeStamp).format("LL")}
        // </span>
        null}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id ? "text-white " : "text-white "
            } border inline-block p-4 my-1 max-w-[50%] break-words `}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="file"
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="p-3 text-2xl rounded-full cursor-pointer transition-all duration-300"
                  onClick={() => handleDownload(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />

      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div className="">
            <img
              src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="p-3 text-2xl rounded-full cursor-pointer transition-all duration-300"
              onClick={() => handleDownload(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="p-3 text-2xl rounded-full cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị tiến trình tải xuống */}
      {isInProgress && (
        <div className="fixed bottom-0 left-0  p-4 bg-gray-800 text-white ">
          <p>Download is {isInProgress ? "in progress" : "stopped"}</p>
          <p>Download size in bytes: {size}</p>
          <label htmlFor="file">Downloading progress:</label>
          <progress id="file" value={percentage} max="100" />
          <p>Elapsed time in seconds: {elapsed}</p>
          {error && <p>Possible error: {JSON.stringify(error)}</p>}
          <button
            className="bg-red-600 mt-3 border-[#ffffff]/20 p-4 rounded-2xl text-white"
            onClick={() => cancel()}
          >
            Cancel the download
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
