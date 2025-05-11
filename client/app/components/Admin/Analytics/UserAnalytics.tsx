"use client";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Loader from "../../Loader/Loader";
import { Typography } from "@mui/material";

type Props = {
  isDashboard?: boolean;
};

const UserAnalytics = ({ isDashboard }: Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const analyticsData: any = [];

  data &&
    data.users.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, count: item.count });
    });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-1">{`${label}`}</p>
          <p className="text-blue-600 dark:text-blue-400 font-medium">{`${payload[0].value} users`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="p-6">
          <div className="mb-6">
            <Typography
              variant="h5"
              className="font-bold text-gray-900 dark:text-white"
            >
              Users Analytics
            </Typography>
            {!isDashboard && (
              <Typography
                variant="body2"
                className="text-gray-500 dark:text-gray-400 mt-1"
              >
                Last 12 months analytics data
              </Typography>
            )}
          </div>

          <div className={`w-full ${isDashboard ? "h-[300px]" : "h-[500px]"}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(160, 174, 192, 0.2)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#718096" }}
                  axisLine={{ stroke: "rgba(160, 174, 192, 0.2)" }}
                  tickLine={{ stroke: "rgba(160, 174, 192, 0.2)" }}
                />
                <YAxis
                  tick={{ fill: "#718096" }}
                  axisLine={{ stroke: "rgba(160, 174, 192, 0.2)" }}
                  tickLine={{ stroke: "rgba(160, 174, 192, 0.2)" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#4F46E5" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalytics;
