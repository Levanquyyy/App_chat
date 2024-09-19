import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ContactChat } from "./components/contactChat";
import { ContainerChat } from "./components/containerChat";
import { EmptyChat } from "./components/emptyChat";

const Chat = () => {
  const { userInfo, selectedChatType, isUploading, fileUploadProgress } =
    useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.info("Please setup your profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex w-full h-[calc(100vh-32px)] overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse"> Uploading File</h5>
          {fileUploadProgress}%
          <span>
            Mua thêm 4g xịn đi tải file lâu vậy tụi m nhắn tin cũng không qua
            đâu =))
          </span>
        </div>
      )}
      <div className="w-[30vw] ">
        <ContactChat />
      </div>
      <div className="flex-1 ">
        {selectedChatType === undefined ? <EmptyChat /> : <ContainerChat />}
      </div>
    </div>
  );
};

export default Chat;
