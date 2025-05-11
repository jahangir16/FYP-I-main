"use client";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";
import { Typography } from "@mui/material";

type Props = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({ isDashboard }: Props) {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

  const analyticsData: any = [];

  data &&
    data.orders.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.name, Count: item.count });
    });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-1">{`${label}`}</p>
          <p className="text-green-600 dark:text-green-400 font-medium">{`${payload[0].value} orders`}</p>
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
              Orders Analytics
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
              <LineChart
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
                {!isDashboard && (
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      color: "#718096",
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="Count"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 0, fill: "#10B981" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
