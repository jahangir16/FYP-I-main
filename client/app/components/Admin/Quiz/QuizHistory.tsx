"use client";

import type React from "react";
import { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Search, Visibility, Edit, Delete } from "@mui/icons-material";
import { useTheme } from "next-themes";
import {
  useGetQuizzesQuery,
  useDeleteQuizMutation,
} from "@/redux/features/quiz/quizApi";
import { toast } from "react-hot-toast";

const QuizHistory: React.FC = () => {
  const { theme } = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  // const [viewQuizOpen, setViewQuizOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Fetch quizzes using Redux Toolkit Query
  const {
    data: quizzesData,
    isLoading,
    error,
    refetch,
  } = useGetQuizzesQuery({});
  const quizzes = quizzesData?.quizzes || [];

  // Delete quiz mutation
  const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredQuizzes = quizzes.filter(
    (quiz: any) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewQuiz = (quiz: any) => {
    // Navigate to the preview quiz page with the quiz ID
    window.location.href = `/admin/quiz?id=${quiz._id}`;
  };

  const handleEditQuiz = (id: string) => {
    // Navigate to edit page
    window.location.href = `/admin/create-quiz?edit=${id}`;
  };

  const handleDeleteConfirm = (quiz: any) => {
    setSelectedQuiz(quiz);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteQuiz = async () => {
    if (selectedQuiz) {
      try {
        await deleteQuiz(selectedQuiz._id).unwrap();
        toast.success("Quiz deleted successfully");
        refetch(); // Refetch quizzes after deletion
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to delete quiz");
      } finally {
        setDeleteConfirmOpen(false);
      }
    }
  };

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      <Card className="mb-8 shadow-md dark:bg-gray-800">
        <CardContent>
          <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Typography variant="h6" className="dark:text-white">
              All Quizzes
            </Typography>

            <Box className="flex gap-3">
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

              <Button
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = "/admin/create-quiz")}
                className="whitespace-nowrap"
              >
                Create New Quiz
              </Button>
            </Box>
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
                    Attempts
                  </TableCell>
                  <TableCell className="font-medium dark:text-white dark:border-gray-700">
                    Status
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
                      colSpan={8}
                      align="center"
                      className="py-8 dark:text-gray-300 dark:border-gray-700"
                    >
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      className="py-8 dark:text-gray-300 dark:border-gray-700"
                    >
                      Error loading quizzes. Please try again.
                    </TableCell>
                  </TableRow>
                ) : filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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
                          {quiz.questions.length}{" "}
                          {/* Display number of questions */}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {quiz.duration} min
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          <Chip
                            label={quiz.level}
                            size="small"
                            color={
                              quiz.level === "Beginner"
                                ? "success"
                                : quiz.level === "Intermediate"
                                ? "primary"
                                : "error"
                            }
                          />
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          {quiz.attempts}
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          <Chip
                            label={
                              quiz.status === "active" ? "Active" : "Inactive"
                            }
                            size="small"
                            color={
                              quiz.status === "active" ? "success" : "default"
                            }
                          />
                        </TableCell>
                        <TableCell className="dark:text-gray-200 dark:border-gray-700">
                          <Box className="flex gap-1">
                            <IconButton
                              size="small"
                              onClick={() => handleViewQuiz(quiz)}
                              className="text-blue-600 dark:text-blue-400"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEditQuiz(quiz._id)}
                              className="text-amber-600 dark:text-amber-400"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteConfirm(quiz)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
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

      {/* View Quiz Dialog */}
      {/* <Dialog
        open={viewQuizOpen}
        onClose={() => setViewQuizOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "dark:bg-gray-800",
        }}
      >
        <DialogTitle className="dark:text-white">
          {selectedQuiz?.title}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 pt-2">
            <Typography variant="subtitle1" className="dark:text-white">
              <span className="font-medium">Course:</span>{" "}
              {selectedQuiz?.courseName}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Typography variant="body1" className="dark:text-gray-300">
                <span className="font-medium">Questions:</span>{" "}
                {selectedQuiz?.questions.length}
              </Typography>
              <Typography variant="body1" className="dark:text-gray-300">
                <span className="font-medium">Duration:</span>{" "}
                {selectedQuiz?.duration} minutes
              </Typography>
              <Typography variant="body1" className="dark:text-gray-300">
                <span className="font-medium">Level:</span>{" "}
                {selectedQuiz?.level}
              </Typography>
            </div>

            <Typography variant="body1" className="dark:text-gray-300">
              <span className="font-medium">Created on:</span>{" "}
              {new Date(selectedQuiz?.dateCreated).toLocaleDateString()}
            </Typography>

            <Typography variant="body1" className="dark:text-gray-300">
              <span className="font-medium">Total attempts:</span>{" "}
              {selectedQuiz?.attempts}
            </Typography>

            <Divider className="dark:border-gray-700 my-3" />

            <Typography variant="subtitle1" className="dark:text-white">
              Questions
            </Typography>

            <List>
              {selectedQuiz?.questions.map((question: any, index: number) => (
                <ListItem
                  key={question._id}
                  className="flex flex-col items-start"
                >
                  <ListItemText
                    primary={`Question ${index + 1}: ${question.question}`}
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          className="dark:text-gray-400"
                        >
                          <span className="font-medium">Options:</span>{" "}
                          {question.options.join(", ")}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="dark:text-gray-400"
                        >
                          <span className="font-medium">Correct Answer:</span>{" "}
                          {question.options[question.correctAnswer]}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="dark:text-gray-400"
                        >
                          <span className="font-medium">Explanation:</span>{" "}
                          {question.explanation}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setViewQuizOpen(false)}
            className="dark:text-gray-300"
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setViewQuizOpen(false);
              handleEditQuiz(selectedQuiz?._id);
            }}
          >
            Edit Quiz
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          className: "dark:bg-gray-800",
        }}
      >
        <DialogTitle className="dark:text-white">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography className="dark:text-gray-300">
            Are you sure you want to delete the quiz{" "}
            <strong>{selectedQuiz?.title}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            className="dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteQuiz}
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizHistory;
