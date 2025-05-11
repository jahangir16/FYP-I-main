"use client";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@mui/material";

// Lazy load heavy components
const DashboardHero = dynamic(
  () => import("@/app/components/Admin/DashboardHero"),
  { ssr: false }
);
const AdminSidebar = dynamic(
  () => import("../../components/Admin/sidebar/AdminSidebar"),
  { ssr: false }
);
const AllUsers = dynamic(
  () => import("../../components/Admin/Users/AllUsers"),
  { ssr: false }
);

type Props = {};

const Page = (props: Props) => {
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
          title="EDUvibe - Admin"
          description="EDUvibe is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
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
            <DashboardHero />
            <div className="mt-16 pt-4">
              <AllUsers isTeam={true} />
            </div>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
