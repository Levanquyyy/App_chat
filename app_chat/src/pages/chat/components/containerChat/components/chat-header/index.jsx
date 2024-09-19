import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { HOST } from "@/utilites/constant";
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 overflow-hidden ">
      <div className="flex gap-5 items-center w-full">
        <div className="flex gap-3 items-center justify-start w-full">
          <div className="relative w-12 h-12">
            {selectedChatType === "contact" &&
              (selectedChatData?.image ? (
                <img
                  src={`${HOST}${selectedChatData.image}`}
                  alt="Avatar preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: selectedChatData.color }}
                >
                  {selectedChatData ? getInitials(selectedChatData.name) : "?"}
                </div>
              ))}
          </div>
          {selectedChatType === "channel" && (
            <p className="text-lg font-bold"> # {selectedChatData.name}</p>
          )}

          {selectedChatType === "contact" && (
            <p className="text-lg font-bold">{selectedChatData.nickname}</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-2xl text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => {
              console.log(selectedChatData);
              closeChat();
            }}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
