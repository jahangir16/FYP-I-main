"use client";
import { useState, useEffect } from "react";
import Heading from "../../../app/utils/Heading";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mui/material";
import AdminProtected from "../../../app/hooks/adminProtected";

// Lazy load components
const AdminSidebar = dynamic(
  () => import("../../components/Admin/sidebar/AdminSidebar"),
  { ssr: false }
);
const DashboardHeader = dynamic(
  () => import("../../../app/components/Admin/DashboardHeader"),
  { ssr: false }
);
const CreateCourse = dynamic(
  () => import("../../components/Admin/Course/CreateCourse"),
  { ssr: false }
);

type Props = {};

const CreateCoursePage = (props: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    // Set initial state based on screen size
    setIsSidebarCollapsed(isMobile);

    // Listen for sidebar state changes
    const handleSidebarStateChange = (e: any) => {
      setIsSidebarCollapsed(e.detail.isCollapsed);
    };

    window.addEventListener("sidebarStateChange", handleSidebarStateChange);

    return () => {
      window.removeEventListener(
        "sidebarStateChange",
        handleSidebarStateChange
      );
    };
  }, [isMobile]);

  return (
    <div>
      <AdminProtected>
        <Heading
          title="EDUvibe - Create Course"
          description="EDUvibe is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning, Course Creation"
        />
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="fixed h-screen z-10">
            <AdminSidebar />
          </div>
          <div
            className={`flex-1 transition-all duration-300 ${
              isMobile
                ? "w-full"
                : isSidebarCollapsed
                ? "md:ml-[70px]"
                : "md:ml-64"
            }`}
          >
            <DashboardHeader />
            <div className="mt-16 pt-4">
              <CreateCourse />
            </div>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default CreateCoursePage;
