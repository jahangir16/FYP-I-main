"use client";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { Typography } from "@mui/material";

type Props = {};

const CourseAnalytics = (props: Props) => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});

  const analyticsData: any = [];

  // Transform data for the chart
  data &&
    data.courses.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.month, courses: item.count });
    });

  const minValue = 0;

  // Colors for the bars
  const colors = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#ff8042",
    "#ff6361",
    "#bc5090",
    "#58508d",
    "#003f5c",
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-300 mb-1">{`${label}`}</p>
          <p className="text-purple-600 dark:text-purple-400 font-medium">{`${payload[0].value} courses`}</p>
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
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="mb-6">
            <Typography
              variant="h5"
              className="font-bold text-gray-900 dark:text-white"
            >
              Course Analytics
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-500 dark:text-gray-400 mt-1"
            >
              Last 12 months course analytics data
            </Typography>
          </div>

          <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
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
                  domain={[minValue, "auto"]}
                  tick={{ fill: "#718096" }}
                  axisLine={{ stroke: "rgba(160, 174, 192, 0.2)" }}
                  tickLine={{ stroke: "rgba(160, 174, 192, 0.2)" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="courses" radius={[4, 4, 0, 0]}>
                  {analyticsData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                  <LabelList
                    dataKey="courses"
                    position="top"
                    fill="#718096"
                    fontSize={12}
                    formatter={(value: number) => (value > 0 ? value : "")}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
