"use client";
import { type FC, useEffect, useState } from "react";
import type React from "react";

import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
  useTheme as useMuiTheme,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Menu,
} from "@mui/material";
import { DataGrid, GridToolbar, type GridColDef } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useRegisterByAdminMutation,
} from "@/redux/features/user/userApi";
import { toast } from "react-hot-toast";
import Loader from "../../Loader/Loader";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
type Props = {
  isTeam?: boolean;
};

type FilterOptions = {
  role: string;
  courseCount: string;
  joinedDate: string;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const [active, setActive] = useState(false);
  const [updateRoleActive, setUpdateRoleActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    role: "all",
    courseCount: "all",
    joinedDate: "all",
  });
  const { data: userData } = useLoadUserQuery(); // Fetch current admin
  const { data: coursesData } = useGetAllCoursesQuery({});
  const {
    isLoading,
    data: usersData,
    refetch,
  } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
  // Filter courses created by the current admin
  const adminCourses = coursesData?.courses.filter(
    (course: any) => course.createdBy === userData?.user._id
  );
  // Filter users enrolled in the admin's courses
  const enrolledUsers = usersData?.users.filter((user: any) =>
    adminCourses?.some((course: any) =>
      user.courses.some((userCourse: any) => {
        const courseId = userCourse.courseId || userCourse._id;
        return courseId === course._id;
      })
    )
  );
  const rows: any = [];
  if (isTeam) {
    const newData =
      enrolledUsers &&
      enrolledUsers.filter((item: any) => item.role === "admin");
    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  } else {
    const newData =
      enrolledUsers &&
      enrolledUsers.filter((item: any) => item.role === "user");

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      });
  }
  // States for new member registration
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("");

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation();

  // New mutation for registration by admin
  const [
    registerByAdmin,
    { isSuccess: registerSuccess, error: registerError },
  ] = useRegisterByAdminMutation();

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
      setUpdateRoleActive(false);
      // Reset registration fields
      setRegEmail("");
      setRegRole("");
    }
    if (deleteSuccess) {
      refetch();
      toast.success("User deleted successfully!");
      setOpen(false);
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (registerSuccess) {
      refetch();
      toast.success("User registered successfully!");
      setActive(false);
      setUpdateRoleActive(false);
      // Reset registration fields
      setRegName("");
      setRegEmail("");
      setRegPassword("");
    }
    if (registerError) {
      if ("data" in registerError) {
        const errorMessage = registerError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [
    updateError,
    isSuccess,
    deleteSuccess,
    deleteError,
    registerSuccess,
    registerError,
    refetch,
  ]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "User",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <Avatar
            sx={{ width: 36, height: 36 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            {params.value.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Typography
              variant="body2"
              className="font-medium text-gray-800 dark:text-white"
            >
              {params.value}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          className="text-gray-600 dark:text-gray-300"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          className={
            params.value === "admin"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }
        />
      ),
    },
    {
      field: "courses",
      headerName: "Courses",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Joined",
      flex: 0.7,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          className="text-gray-500 dark:text-gray-400"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex">
            <Tooltip title="Email User">
              <IconButton
                size="small"
                href={`mailto:${params.row.email}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30"
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Delete User">
              <IconButton
                size="small"
                onClick={() => {
                  setOpen(true);
                  setUserId(params.row.id);
                }}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
          </div>
        );
      },
    },
  ];

  // Filter rows based on search term and filter options
  const filteredRows = rows.filter((row: any) => {
    // Search filter
    const searchMatch =
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const roleMatch =
      filterOptions.role === "all" || row.role === filterOptions.role;

    // Course count filter
    let courseMatch = true;
    if (filterOptions.courseCount === "none") {
      courseMatch = row.courses === 0;
    } else if (filterOptions.courseCount === "1-3") {
      courseMatch = row.courses >= 1 && row.courses <= 3;
    } else if (filterOptions.courseCount === "4+") {
      courseMatch = row.courses >= 4;
    }

    // Date filter - simplified for example
    let dateMatch = true;
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    if (filterOptions.joinedDate === "today") {
      const rowDate = new Date(row.created_at);
      dateMatch = today.getTime() - rowDate.getTime() < oneDay;
    } else if (filterOptions.joinedDate === "week") {
      const rowDate = new Date(row.created_at);
      dateMatch = today.getTime() - rowDate.getTime() < oneWeek;
    } else if (filterOptions.joinedDate === "month") {
      const rowDate = new Date(row.created_at);
      dateMatch = today.getTime() - rowDate.getTime() < oneMonth;
    }

    return searchMatch && roleMatch && courseMatch && dateMatch;
  });

  const handleRegisterSubmit = async () => {
    try {
      if (isTeam) {
        await updateUserRole({ email: regEmail, role: regRole }).unwrap();
      } else {
        await registerByAdmin({
          name: regName,
          email: regEmail,
          password: regPassword,
        }).unwrap();
      }
    } catch (error: any) {
      // Error handled in useEffect
    }
  };

  const handleDelete = async () => {
    await deleteUser(userId);
  };

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilterOptions({
      role: "all",
      courseCount: "all",
      joinedDate: "all",
    });
    setSearchTerm("");
  };

  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      filterOptions.role !== "all" ||
      filterOptions.courseCount !== "all" ||
      filterOptions.joinedDate !== "all"
    );
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
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
                    {isTeam ? "Team Members" : "All Users"}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {filteredRows.length}{" "}
                    {filteredRows.length === 1 ? "user" : "users"} found
                  </Typography>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <TextField
                    placeholder="Search users..."
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
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      className:
                        "bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700",
                    }}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={handleFilterOpen}
                    className={`border-gray-300 dark:border-gray-600 ${
                      hasActiveFilters()
                        ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                    endIcon={
                      hasActiveFilters() && (
                        <Chip
                          size="small"
                          label={
                            Object.values(filterOptions).filter(
                              (v) => v !== "all"
                            ).length + (searchTerm ? 1 : 0)
                          }
                        />
                      )
                    }
                  >
                    Filter
                  </Button>

                  <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterClose}
                    PaperProps={{
                      className:
                        "mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg",
                      style: { width: "300px" },
                    }}
                  >
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-3">
                        <Typography
                          variant="subtitle1"
                          className="font-semibold text-gray-800 dark:text-white"
                        >
                          Filter Users
                        </Typography>
                        {hasActiveFilters() && (
                          <Button
                            size="small"
                            onClick={clearFilters}
                            startIcon={<ClearIcon fontSize="small" />}
                            className="text-gray-600 dark:text-gray-300 text-xs"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>

                      <Divider className="mb-3 dark:border-gray-700" />

                      <div className="space-y-4">
                        <div>
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Courses
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={filterOptions.courseCount}
                              onChange={(e) =>
                                handleFilterChange(
                                  "courseCount",
                                  e.target.value
                                )
                              }
                              className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            >
                              <MenuItem value="all">Any Number</MenuItem>
                              <MenuItem value="none">No Courses</MenuItem>
                              <MenuItem value="1-3">1-3 Courses</MenuItem>
                              <MenuItem value="4+">4+ Courses</MenuItem>
                            </Select>
                          </FormControl>
                        </div>

                        <div>
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Joined
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={filterOptions.joinedDate}
                              onChange={(e) =>
                                handleFilterChange("joinedDate", e.target.value)
                              }
                              className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            >
                              <MenuItem value="all">Any Time</MenuItem>
                              <MenuItem value="today">Today</MenuItem>
                              <MenuItem value="week">This Week</MenuItem>
                              <MenuItem value="month">This Month</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>

                      <Divider className="my-3 dark:border-gray-700" />

                      <div className="flex justify-end">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleFilterClose}
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                          startIcon={<CheckIcon />}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </Menu>

                  <Button
                    variant="contained"
                    startIcon={
                      isTeam ? <AdminPanelSettingsIcon /> : <PersonAddIcon />
                    }
                    onClick={() =>
                      isTeam ? setUpdateRoleActive(true) : setActive(true)
                    }
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  >
                    {isTeam ? "Update Role" : "Add User"}
                  </Button>
                </div>
              </div>

              <Divider className="mb-6 dark:border-gray-700" />

              <Box className="overflow-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  components={{ Toolbar: GridToolbar }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
                  autoHeight
                  className="min-h-[500px]"
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
                    No users found
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-400 dark:text-gray-500 text-center max-w-md"
                  >
                    {searchTerm
                      ? `No results for "${searchTerm}". Try a different search term or clear filters.`
                      : "No users match the current filters. Try changing your filter criteria."}
                  </Typography>
                  {hasActiveFilters() && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={clearFilters}
                      className="mt-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Modal */}
          {(active || updateRoleActive) && (
            <Modal
              open={active || updateRoleActive}
              onClose={() => {
                setActive(false);
                setUpdateRoleActive(false);
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 outline-none border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 dark:text-white"
                  >
                    {isTeam ? "Update User Role" : "Add New User"}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setActive(false);
                      setUpdateRoleActive(false);
                    }}
                    size="small"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  {/* Show only Email & Role if isTeam = true */}
                  {isTeam ? (
                    <>
                      <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        InputLabelProps={{
                          className: "text-gray-600 dark:text-gray-300",
                        }}
                        InputProps={{
                          className:
                            "dark:text-white dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600",
                        }}
                      />
                      <FormControl fullWidth>
                        <InputLabel className="text-gray-600 dark:text-gray-300">
                          Role
                        </InputLabel>
                        <Select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                          className="dark:text-white dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600"
                        >
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <TextField
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        InputLabelProps={{
                          className: "text-gray-600 dark:text-gray-300",
                        }}
                        InputProps={{
                          className:
                            "dark:text-white dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600",
                        }}
                      />
                      <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        InputLabelProps={{
                          className: "text-gray-600 dark:text-gray-300",
                        }}
                        InputProps={{
                          className:
                            "dark:text-white dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600",
                        }}
                      />
                      <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        InputLabelProps={{
                          className: "text-gray-600 dark:text-gray-300",
                        }}
                        InputProps={{
                          className:
                            "dark:text-white dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600",
                        }}
                      />
                    </>
                  )}
                </div>
                <div className="flex justify-end mt-6 gap-2">
                  <Button
                    variant="outlined"
                    className="text-gray-700 dark:text-white border-gray-400 dark:border-gray-600"
                    onClick={() => {
                      setActive(false);
                      setUpdateRoleActive(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className="bg-blue-600 dark:bg-blue-500 text-white"
                    onClick={handleRegisterSubmit}
                    startIcon={<CheckCircleIcon />}
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            </Modal>
          )}

          {/* Delete Confirmation Modal */}
          {/* {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 outline-none border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 dark:text-white"
                  >
                    Confirm Deletion
                  </Typography>
                  <IconButton
                    onClick={() => setOpen(false)}
                    size="small"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>

                <Typography className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </Typography>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outlined"
                    className="text-gray-700 dark:text-white border-gray-400 dark:border-gray-600"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className="bg-red-600 dark:bg-red-500 text-white"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </Box>
            </Modal>
          )} */}
        </Box>
      )}
    </Box>
  );
};

export default AllUsers;
