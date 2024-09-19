import { useNavigate } from "react-router-dom";
import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";
import { useEffect } from "react";

export const ContainerChat = () => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};
