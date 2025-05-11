"use client";
import React, { FC, useEffect, useState } from "react";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import dynamic from "next/dynamic";

// Lazy load components
const SideBarProfile = dynamic(() => import("./SideBarProfile"), {
  ssr: false,
});
const ProfileInfo = dynamic(() => import("./ProfileInfo"), { ssr: false });
const ChangePassword = dynamic(() => import("./ChangePassword"), {
  ssr: false,
});
const CourseCard = dynamic(() => import("../Course/CourseCard"), {
  ssr: false,
});

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const [logOut] = useLogOutMutation();
  const [active, setActive] = useState(1);

  const logOutHandler = async () => {
    setLogout(true);
    try {
      await logOut({}).unwrap();
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLogout(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course !== undefined);
      setCourses(filteredCourses);
    }
  }, [data, user.courses]);

  return (
    <div className="w-[90%] max-w-7xl mx-auto flex flex-col md:flex-row gap-8 my-10">
      <div
        className={`w-full md:w-[300px] h-auto dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-xl shadow-lg p-4 transition-all duration-300 sticky ${
          scroll ? "top-[100px]" : "top-[30px]"
        }`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      <div className="flex-1">
        {active === 1 && (
          <div className="bg-white dark:bg-slate-900 shadow-md rounded-xl p-6">
            <ProfileInfo avatar={avatar} user={user} />
          </div>
        )}

        {active === 2 && (
          <div className="bg-white dark:bg-slate-900 shadow-md rounded-xl p-6">
            <ChangePassword />
          </div>
        )}

        {active === 3 && (
          <div className="px-4 md:px-6">
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} isProfile={true} />
                ))}
              </div>
            ) : (
              <h1 className="text-center text-lg font-semibold text-gray-700 dark:text-white">
                You don&apos;t have any purchased courses!
              </h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
