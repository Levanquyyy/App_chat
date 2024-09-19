import { useAppStore } from "@/store";
import { HOST } from "@/utilites/constant";
export const ContactList = ({ contacts, isChannel = false }) => {
  console.log(contacts);
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);
    if (selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div>
      <div className="mt-5 ">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] text-white p-4" // Thêm class cho liên hệ đã chọn
                : ""
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start  ">
              {!isChannel && (
                <div className="relative w-10 h-10">
                  {contact?.image ? (
                    <img
                      src={`${HOST}${contact.image}`}
                      alt="Avatar preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl"
                      style={{ backgroundColor: contact.color }}
                    >
                      {contact ? getInitials(contact.name) : "?"}
                    </div>
                  )}
                </div>
              )}
              {isChannel && (
                <div className="h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span>
                  {contact.nickname
                    ? `${contact.nickname} `
                    : `${contact.name}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
