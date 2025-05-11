"use client";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import { type FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Avatar, Badge, IconButton, Tooltip } from "@mui/material";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { useSelector } from "react-redux";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<any>([]);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
  }, [data, isSuccess, refetch]);

  useEffect(() => {
    socketId.on("newNotification", () => {
      refetch();
    });
  }, [refetch]);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="w-full bg-white dark:bg-[#111C43] shadow-md h-16 px-6 flex items-center justify-end fixed top-0 right-0">
      {/* Right side - User actions */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        {/* Notifications */}
        <div className="relative">
          <Tooltip title="Notifications">
            <IconButton
              onClick={() => setOpen(!open)}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Badge
                badgeContent={notifications?.length || 0}
                color="error"
                overlap="circular"
              >
                <IoMdNotificationsOutline className="text-2xl" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications dropdown */}
          {open && (
            <div className="w-[350px] max-h-[calc(100vh-4rem)] overflow-y-auto py-3 px-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2A40] shadow-xl absolute top-12 right-0 z-[999] rounded-lg">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 px-3">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Notifications
                </h5>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {notifications?.length || 0} unread
                </span>
              </div>

              {notifications && notifications.length > 0 ? (
                notifications.map((item: any, index: number) => (
                  <div
                    className="mb-2 rounded-lg bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                    key={index}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {item.title}
                        </p>
                        <button
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={() =>
                            handleNotificationStatusChange(item._id)
                          }
                        >
                          Mark as read
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {item.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    No new notifications
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User avatar */}
        <Tooltip title={user?.name || "User"}>
          <Avatar
            src={user?.avatar?.url || "/placeholder-user.jpg"}
            alt={user?.name || "User"}
            className="cursor-pointer border-2 border-gray-200 dark:border-gray-700"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default DashboardHeader;
