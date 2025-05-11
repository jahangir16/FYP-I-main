"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { FiEdit2, FiMoreVertical } from "react-icons/fi";
import { useTheme } from "next-themes";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
  useEnrollStudentMutation,
  useUnenrollStudentMutation,
} from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"; // Import useLoadUserQuery
import { GridToolbar } from "@mui/x-data-grid";
// Lazy load heavy components
const Loader = dynamic(() => import("../../Loader/Loader"), { ssr: false });
const Modal = dynamic(() => import("@mui/material").then((mod) => mod.Modal), {
  ssr: false,
});
const DataGrid = dynamic(
  () => import("@mui/x-data-grid").then((mod) => mod.DataGrid),
  { ssr: false }
);

// Import MUI icons
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AllCourses = () => {
  const { theme } = useTheme();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const [courseId, setCourseId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Instead of anchorEl, use openMenuId to track which course's menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: userData } = useLoadUserQuery(); // Fetch current admin
  const { data: coursesData, isLoading, refetch } = useGetAllCoursesQuery({});
  const [deleteCourse] = useDeleteCourseMutation();
  const [enrollStudent] = useEnrollStudentMutation();
  const [unenrollStudent] = useUnenrollStudentMutation();

  // Filter courses created by the current admin
  const adminCourses = coursesData?.courses.filter(
    (course: any) => course.createdBy === userData?.user._id
  );

  // DataGrid Rows
  const rows =
    adminCourses?.map((item: any, index: number) => ({
      id: item._id || index,
      title: item.name,
      ratings: item.ratings,
      purchased: item.purchased,
      created_at: item.createdAt,
    })) || [];

  // Filter rows based on search term
  const filteredRows = rows.filter((row: any) =>
    row.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Menu Handlers
  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    courseId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(courseId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  // Enroll / Unenroll Handlers
  const handleOpenEnrollModal = (id: string) => {
    setSelectedCourseId(id);
    setOpenEnrollModal(true);
    handleCloseMenu();
  };

  const handleEnrollStudentClick = async (id: string) => {
    try {
      const courseId = id;
      await enrollStudent({ courseId, email }).unwrap();
      toast.success("Student enrolled successfully!");
      setOpenEnrollModal(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Enrollment failed");
    }
  };

  const handleUnenrollStudentClick = async (id: string) => {
    try {
      const courseId = id;
      await unenrollStudent({ courseId, email }).unwrap();
      toast.success("Student unenrolled successfully!");
      handleCloseMenu();
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unenrollment failed");
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    try {
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully!");
      setOpenDeleteModal(false);
      refetch();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  // Edit Handler
  const handleEditCourse = (id: string) => {
    window.location.href = `/admin/edit-course/${id}`;
  };

  // DataGrid Columns
  const columns = [
    {
      field: "title",
      headerName: "Course Title",
      flex: 1,
      renderCell: (params: any) => (
        <Typography
          variant="body2"
          className="font-medium text-gray-800 dark:text-white"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "ratings",
      headerName: "Ratings",
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
    {
      field: "purchased",
      headerName: "Purchased",
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
    {
      field: "created_at",
      headerName: "Created At",
      flex: 0.5,
      renderCell: (params: any) => (
        <Typography
          variant="body2"
          className="text-gray-500 dark:text-gray-400"
        >
          {format(params.row.created_at)}
        </Typography>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params: any) => (
        <>
          <IconButton
            onClick={(event) => handleOpenMenu(event, params.row.id)}
            className="text-gray-600 dark:text-gray-300"
          >
            <FiMoreVertical size={20} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && openMenuId === params.row.id}
            onClose={handleCloseMenu}
            PaperProps={{
              className:
                "mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg",
            }}
          >
            <MenuItem
              onClick={() => handleOpenEnrollModal(params.row.id)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaUserCheck size={18} className="mr-2 text-green-500" />
              <Typography className="text-gray-700 dark:text-gray-200">
                Enroll Student
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleUnenrollStudentClick(params.row.id)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaUserTimes size={18} className="mr-2 text-yellow-500" />
              <Typography className="text-gray-700 dark:text-gray-200">
                Unenroll Student
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => handleEditCourse(params.row.id)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiEdit2 size={18} className="mr-2 text-blue-500" />
              <Typography className="text-gray-700 dark:text-gray-200">
                Edit Course
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenDeleteModal(true);
                setCourseId(params.row.id);
                handleCloseMenu();
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <AiOutlineDelete size={18} className="mr-2 text-red-500" />
              <Typography className="text-gray-700 dark:text-gray-200">
                Delete Course
              </Typography>
            </MenuItem>
          </Menu>
        </>
      ),
    },
    {
      field: "Preview",
      headerName: "Preview",
      flex: 0.2,
      renderCell: (params: any) => (
        <Link href={`/admin/course-preview/${params.row.id}`}>
          <IconButton className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30">
            <AiOutlineEye size={20} />
          </IconButton>
        </Link>
      ),
    },
  ];

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
                    All Courses
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {filteredRows.length}{" "}
                    {filteredRows.length === 1 ? "course" : "courses"} found
                  </Typography>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <TextField
                    placeholder="Search courses..."
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
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    href="/admin/create-course"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  >
                    Add Course
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
                    No courses found
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-400 dark:text-gray-500 text-center max-w-md"
                  >
                    {searchTerm
                      ? `No results for "${searchTerm}". Try a different search term.`
                      : "No courses available. Add a new course to get started."}
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

          {/* Enroll Student Modal */}
          <Modal
            open={openEnrollModal}
            onClose={() => setOpenEnrollModal(false)}
          >
            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 outline-none border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <Typography
                  variant="h6"
                  className="font-bold text-gray-800 dark:text-white"
                >
                  Enroll Student
                </Typography>
                <IconButton
                  onClick={() => setOpenEnrollModal(false)}
                  size="small"
                  className="text-gray-500 dark:text-gray-400"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

              <Divider className="mb-4 dark:border-gray-700" />

              <div className="mt-4">
                <TextField
                  label="Student Email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{
                    className: "text-gray-600 dark:text-gray-300",
                  }}
                  InputProps={{
                    className:
                      "dark:text-white dark:bg-gray-700 rounded-md border-gray-300 dark:border-gray-600",
                  }}
                />
              </div>
              <div className="flex justify-end mt-6 gap-2">
                <Button
                  variant="outlined"
                  className="text-gray-700 dark:text-white border-gray-400 dark:border-gray-600"
                  onClick={() => setOpenEnrollModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-blue-600 dark:bg-blue-500 text-white"
                  onClick={() =>
                    selectedCourseId &&
                    handleEnrollStudentClick(selectedCourseId)
                  }
                  startIcon={<CheckCircleIcon />}
                >
                  Enroll
                </Button>
              </div>
            </Box>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
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
                  onClick={() => setOpenDeleteModal(false)}
                  size="small"
                  className="text-gray-500 dark:text-gray-400"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

              <Typography className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this course? This action cannot
                be undone.
              </Typography>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outlined"
                  className="text-gray-700 dark:text-white border-gray-400 dark:border-gray-600"
                  onClick={() => setOpenDeleteModal(false)}
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
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
