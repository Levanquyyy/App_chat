import { useAppStore } from "@/store";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { UPDATE_USER_INFO } from "@/utilites/constant";
import { useNavigate } from "react-router-dom";
import { HOST, UPLOAD_AVATAR } from "@/utilites/constant";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, selectedColor, setSelectedColor } =
    useAppStore();
  const [nickname, setNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setNickname(userInfo.nickname);
      setSelectedColor(userInfo.color || "#000000");
      setAvatarPreview(userInfo.image ? `${HOST}${userInfo.image}` : null);
    }
  }, [userInfo, setSelectedColor]);
  // Lấy chữ cái đầu tiên của tên người dùng
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  // Hàm xử lý sự kiện khi người dùng thay đổi màu sắc
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ở đây bạn có thể thêm logic để lưu thay đổi lên server
  const validateProfileSetup = () => {
    if (!nickname) {
      toast.error("Nickname is required");
      return false;
    }
    return true;
  };
  // Hàm lưu thay đổi
  const saveChanges = async () => {
    if (validateProfileSetup()) {
      try {
        let updatedUserInfo = { ...userInfo };

        // Tải lên ảnh đại diện nếu có
        if (avatarFile) {
          const formData = new FormData();
          formData.append("avatar", avatarFile);
          const avatarRes = await apiClient.post(UPLOAD_AVATAR, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (avatarRes.status === 200 && avatarRes.data) {
            updatedUserInfo = { ...updatedUserInfo, ...avatarRes.data };
            toast.success("Avatar uploaded successfully");
          }
        }

        // Cập nhật thông tin người dùng
        const res = await apiClient.post(
          UPDATE_USER_INFO,
          {
            nickname,
            color: selectedColor,
          },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          updatedUserInfo = { ...updatedUserInfo, ...res.data };
          setUserInfo(updatedUserInfo);
          setAvatarPreview(
            `${import.meta.env.VITE_SERVER_URL}${updatedUserInfo.image}`
          );
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile");
      }
    }
  };

  return (
    <div className="flex gap-4 items-center space-y-4 h-[100vh] justify-center">
      <div className="relative w-24 h-24">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white text-2xl"
            style={{ backgroundColor: selectedColor }}
          >
            {userInfo ? getInitials(userInfo.name) : "?"}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="space-y-2 w-64">
        <Input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={handleNicknameChange}
        />
        <Input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
        />
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Profile;
