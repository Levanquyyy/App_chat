import { useAppStore } from "@/store";
import { HOST } from "@/utilites/constant";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "@/utilites/constant";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import apiClient from "@/lib/api-client";
import { useSocket } from "@/context/SocketContext";
const ProfileInfo = () => {
  const socket = useSocket();
  const { userInfo, setUserInfo, selectedColor } = useAppStore();
  const navigate = useNavigate();
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Logout successfully");
        navigate("/auth");
        setUserInfo(null);
        setSelectedChatMessages([]);
        socket.disconnect();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center gap-3 px-10 w-full justify-between">
      <div className="flex gap-3 items-center justify-center">
        <div className="relative w-12 h-12">
          {userInfo?.image ? (
            <img
              src={`${HOST}${userInfo.image}`}
              alt="Avatar preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl"
              style={{ backgroundColor: userInfo?.color || selectedColor }}
            >
              {userInfo ? getInitials(userInfo.name) : "?"}
            </div>
          )}
        </div>
        {userInfo?.nickname ? (
          <span className="text-sm font-bold">{userInfo.nickname}</span>
        ) : (
          <span className="text-sm font-bold">{userInfo.name}</span>
        )}
      </div>

      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="dark:text-purple-500 size-5  "
                onClick={() => {
                  navigate("/profile");
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="dark:text-red-500 size-5  "
                onClick={logOut}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
