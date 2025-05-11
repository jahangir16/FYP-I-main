"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

// Import MUI icons
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme, setTheme } = useTheme();
  const { data: userData } = useLoadUserQuery(); // Fetch current admin
  const { data: ordersData, isLoading } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter courses created by the current admin
  const adminCourses = coursesData?.courses.filter(
    (course: any) => course.createdBy === userData?.user._id
  );

  // Filter orders based on admin's courses
  const adminOrders = ordersData?.orders.filter((order: any) =>
    adminCourses?.some((course: any) => course._id === order.courseId)
  );

  useEffect(() => {
    if (adminOrders) {
      const temp = adminOrders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );
        const course = coursesData?.courses.find(
          (course: any) => course._id === item.courseId
        );
        return {
          ...item,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "$" + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [adminOrders, usersData, coursesData]);

  const columns: any = [
    {
      field: "userName",
      headerName: "Name",
      flex: isDashboard ? 0.6 : 0.5,
      renderCell: (params: any) => (
        <Typography
          variant="body2"
          className="font-medium text-gray-800 dark:text-white"
        >
          {params.value}
        </Typography>
      ),
    },
    ...(isDashboard
      ? []
      : [
          {
            field: "userEmail",
            headerName: "Email",
            flex: 1,
            renderCell: (params: any) => (
              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-300"
              >
                {params.value}
              </Typography>
            ),
          },
          {
            field: "title",
            headerName: "Course Title",
            flex: 1,
            renderCell: (params: any) => (
              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-300"
              >
                {params.value}
              </Typography>
            ),
          },
        ]),
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: any) => (
        <Typography
          variant="body2"
          className="text-gray-600 dark:text-gray-300"
        >
          {params.value}
        </Typography>
      ),
    },
    ...(isDashboard
      ? [
          {
            field: "created_at",
            headerName: "Created At",
            flex: 0.5,
            renderCell: (params: any) => (
              <Typography
                variant="body2"
                className="text-gray-500 dark:text-gray-400"
              >
                {params.value}
              </Typography>
            ),
          },
        ]
      : [
          {
            field: " ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => {
              return (
                <a href={`mailto:${params.row.userEmail}`}>
                  <IconButton className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30">
                    <AiOutlineMail size={20} />
                  </IconButton>
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  orderData &&
    orderData.forEach((item: any) => {
      rows.push({
        id: item._id,
        userName: item.userName,
        userEmail: item.userEmail,
        title: item.title,
        price: item.price,
        created_at: format(item.createdAt),
      });
    });

  // Filter rows based on search term
  const filteredRows = rows.filter((row: any) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <Card
            elevation={0}
            className="border border-gray-200 dark:border-gray-700 rounded-xl mb-6 overflow-hidden"
          >
            <CardContent className="p-6 bg-white dark:bg-gray-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <Typography
                    variant="h5"
                    className="font-bold text-gray-800 dark:text-white mb-1"
                  >
                    {isDashboard ? "Recent Orders" : "All Invoices"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {filteredRows.length}{" "}
                    {filteredRows.length === 1 ? "invoice" : "invoices"} found
                  </Typography>
                </div>
                {!isDashboard && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <TextField
                      placeholder="Search invoices..."
                      variant="outlined"
                      size="small"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="min-w-[200px]"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon className="text-gray-400 dark:text-gray-500" />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm("")}
                              edge="end"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                        className:
                          "bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700",
                      }}
                    />
                  </div>
                )}
              </div>

              {!isDashboard && (
                <Divider className="mb-6 dark:border-gray-700" />
              )}

              <Box className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <DataGrid
                  checkboxSelection={false} // Disable checkbox selection
                  disableRowSelectionOnClick // Disable row selection on click
                  rows={filteredRows}
                  columns={columns}
                  components={isDashboard ? {} : { Toolbar: GridToolbar }}
                  autoHeight
                  className={isDashboard ? "!h-[35vh]" : "min-h-[80vh]"}
                  sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: theme === "dark" ? "#1F2A40" : "#F9FAFB",
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                      borderBottom: `1px solid ${
                        theme === "dark" ? "#2D3748" : "#E5E7EB"
                      }`,
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      backgroundColor: theme === "dark" ? "#111C43" : "#fff",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      backgroundColor: theme === "dark" ? "#1F2A40" : "#F9FAFB",
                      borderTop: `1px solid ${
                        theme === "dark" ? "#2D3748" : "#E5E7EB"
                      }`,
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: `1px solid ${
                        theme === "dark" ? "#2D3748" : "#F3F4F6"
                      }`,
                    },
                    "& .MuiTablePagination-root": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiTablePagination-selectLabel": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiTablePagination-displayedRows": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiTablePagination-select": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiTablePagination-selectIcon": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiIconButton-root": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: theme === "dark" ? "#1E293B" : "#F9FAFB",
                    },
                    "& .MuiDataGrid-columnSeparator": {
                      color: theme === "dark" ? "#2D3748" : "#E5E7EB",
                    },
                    "& .MuiDataGrid-menuIcon": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiDataGrid-sortIcon": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiCheckbox-root": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                      color: theme === "dark" ? "#E2E8F0" : "#1F2937",
                    },
                  }}
                />
              </Box>

              {filteredRows.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <SearchIcon
                    className="text-gray-400 mb-2"
                    style={{ fontSize: 48 }}
                  />
                  <Typography
                    variant="h6"
                    className="text-gray-500 dark:text-gray-400 mb-1"
                  >
                    No invoices found
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-400 dark:text-gray-500 text-center max-w-md"
                  >
                    {searchTerm
                      ? `No results for "${searchTerm}". Try a different search term.`
                      : "No invoices available."}
                  </Typography>
                  {searchTerm && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSearchTerm("")}
                      className="mt-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;
