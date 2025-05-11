"use client";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";
import { useSession } from "next-auth/react";
import {
  useLogOutMutation,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";
import dynamic from "next/dynamic";

// Lazy load authentication components
const CustomModal = dynamic(() => import("../utils/CustomModal"), {
  ssr: false,
});
const Login = dynamic(() => import("../components/Auth/Login"), { ssr: false });
const SignUp = dynamic(() => import("../components/Auth/SignUp"), {
  ssr: false,
});
const Verification = dynamic(() => import("../components/Auth/Verification"), {
  ssr: false,
});

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [role, setRole] = useState<"user" | "admin">("user");
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {});
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logOut] = useLogOutMutation();

  useEffect(() => {
    if (!isLoading) {
      if (!userData && data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image,
        });
        refetch();
      }
      if (data === null && isSuccess) {
        toast.success("Login Successfully");
      }
    }
  }, [data, userData, isLoading, isSuccess, socialAuth, refetch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setActive(window.scrollY > 85);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  const handleLogout = async () => {
    await logOut({}).unwrap();
    window.location.href = "/";
    toast.success("Logged out successfully");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full relative">
          <div
            className={`${
              active
                ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
                : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow bg-white dark:bg-gray-900"
            }`}
          >
            <div className="w-[95%] 800px:w-[92%] m-auto h-full">
              <div className="w-full h-[80px] flex items-center justify-between">
                <div>
                  <Link href="/" className="flex items-center gap-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      E
                    </div>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">
                      EDU<span className="text-blue-600">vibe</span>
                    </span>
                  </Link>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden 800px:flex">
                    <NavItems activeItem={activeItem} isMobile={false} />
                    {userData?.user.role === "user" && (
    <Link href="/student/quizzes" className="ml-4 text-blue-600 hover:underline">
      Quizzes
    </Link>)}
                  </div>
                  <ThemeSwitcher />
                  {userData ? (
                    <div className="flex items-center gap-3">
                      <Link href={"/profile"}>
                        <div className="relative">
                          <Image
                            src={
                              userData?.user.avatar
                                ? userData.user.avatar.url
                                : avatar
                            }
                            alt=""
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 p-[2px]"
                            style={{
                              borderColor:
                                activeItem === 5 ? "#3b82f6" : "#e5e7eb",
                            }}
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                      </Link>
                      <button
                        className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        className="hidden 800px:flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        onClick={() => {
                          setRole("admin");
                          setRoute("Login");
                          setOpen(true);
                        }}
                      >
                        Instructor Login
                      </button>
                      <button
                        className="hidden 800px:flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                        onClick={() => {
                          setRole("user");
                          setRoute("Login");
                          setOpen(true);
                        }}
                      >
                        Student Login
                      </button>
                      <button
                        className="800px:hidden flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                        onClick={() => {
                          setRoute("Login");
                          setOpen(true);
                        }}
                      >
                        <HiOutlineUserCircle size={22} />
                      </button>
                    </div>
                  )}
                  <button
                    className="800px:hidden flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    onClick={() => setOpenSidebar(true)}
                  >
                    <HiOutlineMenuAlt3 size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {openSidebar && (
            <div
              className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-gray-900/60 bg-black/60"
              onClick={handleClose}
              id="screen"
            >
              <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-gray-900 dark:bg-opacity-90 top-0 right-0 shadow-xl transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-5 border-b dark:border-gray-800">
                    <Link href="/" className="flex items-center gap-1">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        E
                      </div>
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        EDU<span className="text-blue-600">vibe</span>
                      </span>
                    </Link>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setOpenSidebar(false)}
                      title="Close Sidebar"
                    >
                      <HiXMark size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto py-4 px-5">
                    <NavItems activeItem={activeItem} isMobile={true} />
                                        {userData?.user.role === "student" && (
                      <Link
                        href="/student/quizzes"
                        className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setOpenSidebar(false)}
                      >
                        Quizzes
                      </Link>
                    )}
                  </div>
                                    {userData?.user.role === "student" && (
                    <Link
                      href="/student/quizzes"
                      className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setOpenSidebar(false)}
                    >
                      Quizzes
                    </Link>
                  )}
                  <div className="p-5 border-t dark:border-gray-800">
                    {userData ? (
                      <div className="flex flex-col gap-3">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setOpenSidebar(false)}
                        >
                          <Image
                            src={
                              userData?.user.avatar
                                ? userData.user.avatar.url
                                : avatar
                            }
                            alt=""
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              {userData?.user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              View Profile
                            </div>
                          </div>
                        </Link>
                        <button
                          className="w-full py-2.5 px-4 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <button
                          className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            setRole("user");
                            setRoute("Login");
                            setOpen(true);
                            setOpenSidebar(false);
                          }}
                        >
                          Student Login
                        </button>
                        <button
                          className="w-full py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          onClick={() => {
                            setRole("admin");
                            setRoute("Login");
                            setOpen(true);
                            setOpenSidebar(false);
                          }}
                        >
                          Instructor Login
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auth Modals */}
          {route === "Login" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
              role={role}
            />
          )}
          {route === "Sign-Up" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
              role={role}
            />
          )}
          {route === "Verification" && open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
              role={role}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Header;
