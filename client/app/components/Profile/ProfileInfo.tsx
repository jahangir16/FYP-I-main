import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-hot-toast";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import avatarIcon from "../../../public/assests/avatar.png";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [localAvatar, setLocalAvatar] = useState(
    user?.avatar?.url || avatar || avatarIcon
  );
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isLoading, isSuccess: success, error: updateError }] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const { refetch } = useLoadUserQuery(undefined, { skip: !loadUser }); // Add refetch function

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          const newAvatar = fileReader.result as string;
          setLocalAvatar(newAvatar);
          updateAvatar(newAvatar);
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  // Refetch user data when loadUser is true
  useEffect(() => {
    if (loadUser) {
      refetch().then(({ data }) => {
        if (data) {
          setLocalAvatar(data.user.avatar?.url || avatarIcon); // Update localAvatar with new data
        }
      });
      setLoadUser(false); // Reset loadUser state
    }
  }, [loadUser, refetch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      await editProfile({ name });
    }
    if (isSuccess || success) {
      toast.success("Profile updated successfully!");
      setLoadUser(true); // Trigger refetch of user data
    }
    if (error || updateError) {
      console.error(error || updateError);
    }
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="w-full max-w-[600px] bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
        <div className="flex justify-center">
          <div className="relative">
            <Image
              src={localAvatar}
              alt="User Avatar"
              width={130}
              height={130}
              className="w-[130px] h-[130px] border-4 border-teal-500 rounded-full shadow-md object-cover"
            />
            <input
              type="file"
              id="avatar"
              className="hidden"
              accept="image/png,image/jpg,image/jpeg,image/webp"
              onChange={imageHandler}
              title="Upload Avatar"
              placeholder="Upload Avatar"
            />
            <label htmlFor="avatar" className="cursor-pointer">
              <div className="w-[35px] h-[35px] bg-teal-600 hover:bg-teal-500 transition-all rounded-full absolute bottom-2 right-2 flex items-center justify-center shadow-md">
                <AiOutlineCamera size={22} className="text-white" />
              </div>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-not-allowed"
              value={user?.email}
              placeholder="Enter your Email"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-lg transition-all shadow-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
