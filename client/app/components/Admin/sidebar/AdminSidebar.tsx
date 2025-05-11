"use client";
import { type FC, useEffect, useState } from "react";
import { IconButton, Typography, Drawer, useMediaQuery } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import avatarDefault from "../../../../public/assests/avatar.png";

// Import MUI icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CreateIcon from "@mui/icons-material/Create";
import WebIcon from "@mui/icons-material/Web";
import QuizIcon from "@mui/icons-material/Quiz";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (title: string) => void;
  isCollapsed: boolean;
}

const Item: FC<ItemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  isCollapsed,
}) => {
  const isActive = selected === title;

  return (
    <Link href={to} className="no-underline">
      <div
        className={`flex items-center px-3 py-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 
          ${
            isActive
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        onClick={() => setSelected(title)}
      >
        <div className={`text-xl ${isCollapsed ? "mx-auto" : "mr-4"}`}>
          {icon}
        </div>
        {!isCollapsed && (
          <Typography className="font-medium text-sm">{title}</Typography>
        )}
      </div>
    </Link>
  );
};

const AdminSidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const [logout] = useLogOutMutation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const pathname = usePathname();
  // Define menu items with their routes
  const menuItems = [
    { title: "Dashboard", to: "/admin", icon: <HomeOutlinedIcon /> },
    { title: "Users", to: "/admin/users", icon: <GroupsIcon /> },
    { title: "Invoices", to: "/admin/invoices", icon: <ReceiptOutlinedIcon /> },
    {
      title: "My Courses",
      to: "/admin/my-courses",
      icon: <LibraryBooksIcon />,
    },
    {
      title: "Create Course",
      to: "/admin/create-course",
      icon: <CreateIcon />,
    },
    { title: "Hero", to: "/admin/hero", icon: <WebIcon /> },
    { title: "FAQ", to: "/admin/faq", icon: <QuizIcon /> },
    { title: "Categories", to: "/admin/categories", icon: <WysiwygIcon /> },
    // Add these new items
    {
      title: "Create Quiz",
      to: "/admin/create-quiz",
      icon: <CreateIcon />,
    },
    {
      title: "Quiz History",
      to: "/admin/quiz-history",
      icon: <ManageHistoryIcon />,
    },
    // End of new items
    { title: "Manage Team", to: "/admin/team", icon: <PeopleOutlinedIcon /> },
    {
      title: "Courses Analytics",
      to: "/admin/courses-analytics",
      icon: <BarChartOutlinedIcon />,
    },
    {
      title: "Orders Analytics",
      to: "/admin/orders-analytics",
      icon: <MapOutlinedIcon />,
    },
    {
      title: "Users Analytics",
      to: "/admin/users-analytics",
      icon: <ManageHistoryIcon />,
    },
    { title: "Logout", to: "/", icon: <ExitToAppIcon /> },
  ];

  useEffect(() => {
    setMounted(true);

    // Set collapsed state based on screen size
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  // Set selected menu item based on current route
  useEffect(() => {
    if (pathname) {
      // Find the menu item that matches the current path
      const currentMenuItem = menuItems.find((item) => {
        // Exact match for dashboard
        if (item.to === "/admin" && pathname === "/admin") {
          return true;
        }
        // For other routes, check if the pathname starts with the menu item's path
        // This handles nested routes like /admin/users/123
        return pathname.startsWith(item.to) && item.to !== "/admin";
      });

      if (currentMenuItem) {
        setSelected(currentMenuItem.title);
      }
    }
  }, [pathname]);

  // Add this to ensure the sidebar state is properly passed to the parent component
  useEffect(() => {
    // If there's a prop for updating parent state, use it
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent("sidebarStateChange", { detail: { isCollapsed } })
      );
    }
  }, [isCollapsed]);

  if (!mounted) {
    return null;
  }

  const logoutHandler = async () => {
    try {
      await logout({}).unwrap();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarContent = (
    <div
      className={`h-screen overflow-hidden transition-all duration-300 bg-white dark:bg-[#111C43] ${
        isCollapsed ? "w-[70px]" : "w-64"
      }`}
    >
      {/* Fixed Header */}
      <div
        className={`fixed top-0 left-0 z-10 bg-white dark:bg-[#111C43] border-b border-gray-200 dark:border-gray-700 ${
          isCollapsed ? "w-[70px]" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-3">
          {!isCollapsed && (
            <Link href="/" className="no-underline text-center">
              <h3 className="text-xl font-bold dark:text-white text-black uppercase">
                EDU Vibe
              </h3>
            </Link>
          )}
          <IconButton
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        className={`pt-20 h-full overflow-y-auto overflow-x-hidden ${
          isCollapsed ? "w-[70px]" : "w-64"
        }`}
      >
        {/* User Profile */}
        <div
          className={`flex flex-col items-center py-6 ${
            isCollapsed ? "px-2" : "px-4"
          } border-b border-gray-200 dark:border-gray-700`}
        >
          <div className="relative w-14 h-14 mb-3">
            <Image
              alt="profile-user"
              src={user?.avatar ? user.avatar.url : avatarDefault}
              fill
              className="rounded-full border-2 border-blue-500 p-0.5 bg-white"
              style={{ objectFit: "cover" }}
            />
          </div>
          {!isCollapsed && (
            <div className="text-center">
              <Typography className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                {user?.name}
              </Typography>
              <Typography className="text-xs text-gray-600 dark:text-gray-400 capitalize mt-1">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {user?.role}
                </span>
              </Typography>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className={`p-2 ${isCollapsed ? "space-y-5" : "space-y-2"}`}>
          <Item
            title="Dashboard"
            to="/admin"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          {!isCollapsed && (
            <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-6 mb-3 px-3">
              Data
            </Typography>
          )}
          <Item
            title="Users"
            to="/admin/users"
            icon={<GroupsIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Invoices"
            to="/admin/invoices"
            icon={<ReceiptOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          {!isCollapsed && (
            <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-6 mb-3 px-3">
              Content
            </Typography>
          )}
          <Item
            title="My Courses"
            to="/admin/my-courses"
            icon={<LibraryBooksIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Create Course"
            to="/admin/create-course"
            icon={<CreateIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          {!isCollapsed && (
            <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-6 mb-3 px-3">
              Customization
            </Typography>
          )}
          <Item
            title="Hero"
            to="/admin/hero"
            icon={<WebIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="FAQ"
            to="/admin/faq"
            icon={<QuizIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Categories"
            to="/admin/categories"
            icon={<WysiwygIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          {!isCollapsed && (
            <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-6 mb-3 px-3">
              Quizzes
            </Typography>
          )}
          <Item
            title="Create Quiz"
            to="/admin/create-quiz"
            icon={<CreateIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Quiz History"
            to="/admin/quiz-history"
            icon={<ManageHistoryIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          {!isCollapsed && (
            <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-6 mb-3 px-3">
              Controllers
            </Typography>
          )}
          <Item
            title="Manage Team"
            to="/admin/team"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          {!isCollapsed && (
            <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-6 mb-3 px-3">
              Analytics
            </Typography>
          )}
          <Item
            title="Courses Analytics"
            to="/admin/courses-analytics"
            icon={<BarChartOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Orders Analytics"
            to="/admin/orders-analytics"
            icon={<MapOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Users Analytics"
            to="/admin/users-analytics"
            icon={<ManageHistoryIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          {!isCollapsed && (
            <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-6 mb-3 px-3">
              Extras
            </Typography>
          )}
          <div onClick={logoutHandler}>
            <Item
              title="Logout"
              to="/"
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile drawer for responsive design
  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md rounded-md"
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon className="text-gray-700 dark:text-gray-300" />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={`h-screen transition-all duration-300 ${
        isCollapsed ? "w-[70px]" : "w-64"
      } shadow-lg
      z-100 fixed left-0 top-0 
      `}
    >
      {sidebarContent}
    </div>
  );
};

export default AdminSidebar;
