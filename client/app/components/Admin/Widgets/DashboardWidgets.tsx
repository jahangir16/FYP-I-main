"use client";
import { type FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import CourseAnalytics from "../Analytics/CourseAnalytics";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

// Icons
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
        sx={{
          color: value && value > 0 ? "#4ade80" : "#ef4444",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>();
  const [userComparePercentage, setUserComparePercentage] = useState<any>();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [adminCourseSales, setAdminCourseSales] = useState<any>(null);

  const { data, isLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (isLoading && ordersLoading) {
      return;
    } else {
      if (data && ordersData) {
        const usersLastTwoMonths = data.users.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count;
          const usersPreviousMonth = usersLastTwoMonths[0].count;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count;

          const usersPercentChange =
            usersPreviousMonth !== 0
              ? ((usersCurrentMonth - usersPreviousMonth) /
                  usersPreviousMonth) *
                100
              : 100;

          const ordersPercentChange =
            ordersPreviousMonth !== 0
              ? ((ordersCurrentMonth - ordersPreviousMonth) /
                  ordersPreviousMonth) *
                100
              : 100;

          setUserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    }
  }, [isLoading, ordersLoading, data, ordersData]);

  // Fetch total users enrolled in courses created by the current admin user
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("/api/total-users");
        const result = await response.json();
        setTotalUsers(result.totalUsers);
      } catch (error) {
        console.error("Failed to fetch total users:", error);
      }
    };

    fetchTotalUsers();
  }, []);

  // Fetch sales data for courses created by the current admin user
  useEffect(() => {
    const fetchAdminCourseSales = async () => {
      try {
        const response = await fetch("/api/admin-course-sales");
        const result = await response.json();
        setAdminCourseSales(result);
      } catch (error) {
        console.error("Failed to fetch admin course sales:", error);
      }
    };

    fetchAdminCourseSales();
  }, []);

  // Calculate sales obtained for the current admin's courses
  const calculateAdminSales = () => {
    if (!adminCourseSales) return { currentMonth: 0, percentChange: 0 };

    const salesLastTwoMonths = adminCourseSales.last12Months.slice(-2);
    if (salesLastTwoMonths.length === 2) {
      const currentMonthSales = salesLastTwoMonths[1].count;
      const previousMonthSales = salesLastTwoMonths[0].count;

      const percentChange =
        previousMonthSales !== 0
          ? ((currentMonthSales - previousMonthSales) / previousMonthSales) *
            100
          : 100;

      return {
        currentMonth: currentMonthSales,
        percentChange: percentChange,
      };
    }

    return { currentMonth: 0, percentChange: 0 };
  };

  const adminSales = calculateAdminSales();

  return (
    <div className="mt-[30px] min-h-screen">
      {/* Top Section: Total Users and Sales Obtained */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Total Users Card */}
        <Card className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center p-5 justify-around">
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
                <PiUsersFourLight className="text-purple-600 dark:text-purple-400 text-[24px]" />
              </div>
              <Typography
                variant="h5"
                className="font-bold text-gray-900 dark:text-white"
              >
                {totalUsers}
              </Typography>
              <Typography className="text-gray-500 dark:text-gray-400 font-medium">
                Enrolled Users
              </Typography>
            </div>
          </div>
        </Card>

        {/* Sales Obtained Card */}
        <Card className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center p-5 justify-around">
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                <BiBorderLeft className="text-blue-600 dark:text-blue-400 text-[24px]" />
              </div>
              <Typography
                variant="h5"
                className="font-bold text-gray-900 dark:text-white"
              >
                {adminSales.currentMonth}
              </Typography>
              <Typography className="text-gray-500 dark:text-gray-400 font-medium">
                Sales Obtained
              </Typography>
            </div>
            <div className="flex flex-col items-center">
              <CircularProgressWithLabel
                value={adminSales.percentChange > 0 ? 100 : 0}
                open={open}
              />
              <div className="flex items-center mt-2 gap-1">
                {adminSales.percentChange > 0 ? (
                  <AiOutlineRise className="text-green-500 w-4 h-4" />
                ) : (
                  <AiOutlineFall className="text-red-500 w-4 h-4" />
                )}
                <Typography
                  className={`font-medium ${
                    adminSales.percentChange > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {adminSales.percentChange > 0
                    ? "+" + adminSales.percentChange.toFixed(2)
                    : "-" + Math.abs(adminSales.percentChange).toFixed(2)}
                  %
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section: Analytics Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* User Analytics Chart */}
        <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <UserAnalytics isDashboard={true} />
        </Card>

        {/* Orders Analytics Chart */}
        <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <OrdersAnalytics isDashboard={true} />
        </Card>

        {/* Course Analytics Chart */}
        <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <CourseAnalytics />
        </Card>
      </div>
    </div>
  );
};

export default DashboardWidgets;
