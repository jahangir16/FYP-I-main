"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
  Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useGetQuizzesQuery } from "../../../redux/features/quiz/quizApi";
import { useSelector } from "react-redux";

const UserQuizList: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state: any) => state.auth);
  const enrolledCourseIds = user?.courses?.map((course: any) => course._id) || [];

  // Fetch quizzes using Redux Toolkit Query
  const { data: quizzesData, isLoading, error } = useGetQuizzesQuery({});
  const quizzes = quizzesData?.quizzes || [];

  // Filter only the quizzes of enrolled courses
  const filteredByCourse = quizzes.filter((quiz: any) =>
    enrolledCourseIds.includes(quiz.courseId._id)
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter quizzes based on the search term
  const filteredQuizzes = filteredByCourse.filter(
    (quiz: any) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Card className="mb-8 shadow-md dark:bg-gray-800">
        <CardContent>
          <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Typography variant="h6" className="dark:text-white">
              All Quizzes
            </Typography>

            <TextField
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              className="min-w-[220px] dark:bg-gray-700 rounded-md"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="dark:text-gray-300" />
                  </InputAdornment>
                ),
                className: "dark:text-white",
              }}
            />
          </Box>

          <Divider className="mb-4 dark:border-gray-700" />

          <Box className="overflow-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-medium dark:text-white dark:border-gray-700">
                    Quiz Name
                  </TableCell>
                  <TableCell className="font-medium dark:text-white dark:border-gray-700">
                    Course
                  </TableCell>
                  <TableCell className="font-medium dark:text-white dark:border-gray-700">
                    Questions
                  </TableCell>
                  <TableCell className="font-medium dark:text-white dark:border-gray-700">
                    Duration
                  </TableCell>
                  <TableCell className="font-medium dark:text-white dark:border-gray-700">
                    Level
                  </TableCell>
                  <TableCell className="font-medium dark:text-white dark:border-gray-700">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      className="py-8 dark:text-gray-300 dark:border-gray-700"
                    >
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      className="py-8 dark:text-gray-300 dark:border-gray-700"
                    >
                      Error loading quizzes. Please try again.
                    </TableCell>
                  </TableRow>
                ) : filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      className="py-8 dark:text-gray-300 dark:border-gray-700"
                    >
                      No quizzes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizzes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((quiz: any) => (
                      <TableRow
                        key={quiz._id}
                        hover
                        className="dark:hover:bg-gray-700"
                      >
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {quiz.title}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {quiz.courseName}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {quiz.questions.length}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {quiz.duration} min
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {quiz.level}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              router.push(`/student/quiz?id=${quiz._id}`);
                            }}
                          >
                            Start Quiz
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={filteredQuizzes.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="dark:text-gray-300"
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserQuizList;