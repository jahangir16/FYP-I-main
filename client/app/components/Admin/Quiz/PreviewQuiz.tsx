"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  CheckCircle,
  Timer,
  School,
  MenuBook,
  SignalCellularAlt,
  Help,
  NavigateBefore,
  NavigateNext,
  Lightbulb,
  Close,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useTheme } from "next-themes";
import { useGetQuizByIdQuery,useSaveQuizResultMutation } from "@/redux/features/quiz/quizApi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux"; 

const PreviewQuiz: React.FC<{ previewMode?: "admin" | "student" }> = ({ previewMode = "admin" }) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams ? searchParams.get("id") : null;
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showAnswers, setShowAnswers] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [explanationOpen, setExplanationOpen] = useState(false);
  // const [previewMode, setPreviewMode] = useState<"admin" | "student">("admin");
  const [submittedAnswers, setSubmittedAnswers] = useState<{
    [key: number]: number | null;
  }>({}); // Track submitted answers for each question
  const [quizStarted, setQuizStarted] = useState(false); // Track if the quiz has started
  const [timeLeft, setTimeLeft] = useState(0); // Timer in seconds
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation popup
  const [saveQuizResult] = useSaveQuizResultMutation(); // Use the mutation hook
  const { user } = useSelector((state: any) => state.auth); // Adjust to your store shape
 console.log("user data:  ",user);
  const submitQuizResult = async () => {
    try {
      const quizResult = {
        studentId: user._id, // Replace with actual student ID
        quizId: quizId, // Use the quizId from the component state
        courseId: quiz?.courseId._id, // Use the courseId from the quiz data
        marksObtained: calculateMarks(), // Function to calculate total marks
        totalMarks: quiz?.questions.length, // Total number of questions
        questionResults: Object.keys(submittedAnswers).map((key) => ({
          questionId: quiz?.questions[key]._id,
          marksObtained:
            submittedAnswers[Number(key)] === quiz?.questions[Number(key)].correctAnswer ? 1 : 0,
        })),
      };
  
      console.log("Payload being sent to the backend:", quizResult); // Log the payload
  
      const response = await saveQuizResult(quizResult).unwrap(); // Call the mutation
     // Redirect to the quizzes page
      router.push("http://localhost:3000/student/quizzes");
      console.log("Quiz result saved successfully:", response);
      toast.success("Quiz result saved successfully!");
    } catch (error) {
      console.error("Error saving quiz result:", error);
      toast.error("Failed to save quiz result.");
    }
  };

  const calculateMarks = () => {
    return Object.keys(submittedAnswers).reduce((total, key) => {
      return (
        total +
        (submittedAnswers[Number(key)] === quiz?.questions[Number(key)].correctAnswer ? 1 : 0)
      );
    }, 0);
  };




  // Fetch quiz data using Redux Toolkit Query
  const {
    data: quizData,
    isLoading,
    error,
  } = useGetQuizByIdQuery(quizId, {
    skip: !quizId,
  });

  const quiz = quizData?.quiz;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load quiz details");
    }
  }, [error]);

  useEffect(() => {
    if (previewMode === "student" && quiz) {
      setShowConfirmation(true); // Show confirmation popup in student view
    }
  }, [previewMode, quiz]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (quizStarted && timeLeft === 0) {
      handleAutoSubmit(); // Auto-submit when time runs out
    }
  }, [quizStarted, timeLeft]);

  const handleEditQuiz = () => {
    if (quiz?._id) {
      router.push(`/admin/create-quiz?edit=${quiz._id}`);
    }
  };

  const handleBackToList = () => {
    router.push("/admin/quiz-history");
  };

  const handleOptionSelect = (index: number) => {
    if (previewMode === "student" && !submittedAnswers[activeQuestion]) {
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption !== null) {
      setSubmittedAnswers((prev) => ({
        ...prev,
        [activeQuestion]: selectedOption,
      }));
    }
  };

  const handleAutoSubmit = async () => {
    const updatedAnswers = { ...submittedAnswers };
    quiz?.questions.forEach((_: any, index: number) => {
      if (updatedAnswers[index] === undefined) {
        updatedAnswers[index] = null;
      }
    });
    setSubmittedAnswers(updatedAnswers);
    setQuizStarted(false);
    toast.success("Time's up! Quiz submitted automatically.");
    await submitQuizResult(); // Submit result after timer ends
  };
  

  const handleStartQuiz = () => {
    if (quiz) {
      setQuizStarted(true);
      setTimeLeft(quiz.duration * 60); // Convert minutes to seconds
      setShowConfirmation(false); // Close the confirmation popup
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestion < (quiz?.questions?.length || 0) - 1) {
      setActiveQuestion((prev) => prev + 1);
      setSelectedOption(submittedAnswers[activeQuestion + 1] ?? null); // Restore selected option for the next question
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestion > 0) {
      setActiveQuestion((prev) => prev - 1);
      setSelectedOption(submittedAnswers[activeQuestion - 1] ?? null); // Restore selected option for the previous question
    }
  };

  // const togglePreviewMode = () => {
  //   setPreviewMode(previewMode === "admin" ? "student" : "admin");
  //   setSelectedOption(null);
  //   setSubmittedAnswers({}); // Reset submitted answers when switching modes
  //   setQuizStarted(false); // Reset quiz state
  //   setTimeLeft(0); // Reset timer
  // };

  if (isLoading) {
    return (
      <Box className="flex flex-col justify-center items-center h-[70vh]">
        <CircularProgress size={40} className="mb-4" />
        <Typography variant="h6" className="dark:text-white">
          Loading quiz...
        </Typography>
      </Box>
    );
  }

  if (!quiz && !isLoading) {
    return (
      <Box className="p-6 max-w-7xl mx-auto">
        <Card className="shadow-md dark:bg-slate-800">
          <CardContent className="p-6">
            <Typography variant="h6" className="text-center dark:text-white">
              Quiz not found or select a quiz to preview
            </Typography>
            <Box className="flex justify-center mt-4">
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={handleBackToList}
              >
                Back to Quiz List
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const progressPercentage =
    ((activeQuestion + 1) / (quiz?.questions?.length || 1)) * 100;

  const isQuestionSubmitted = submittedAnswers[activeQuestion] !== undefined;

  return (
    <Box className="p-4 md:p-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-100px)] scrollbar-hide">
      {/* Confirmation Popup */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "dark:bg-slate-800",
        }}
      >
        <DialogTitle className="dark:text-white flex justify-between items-center">
          <Typography variant="h6">Start Quiz?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography className="dark:text-gray-300">
            Are you ready to start the quiz? You will have {quiz?.duration}{" "}
            minutes to complete it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleStartQuiz} variant="contained" color="primary">
            Start Quiz
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Header */}
      <Card className="mb-6 shadow-md dark:bg-slate-800 overflow-hidden">
        <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4">
          <Typography variant="h5" className="font-bold text-white mb-1">
            {quiz?.title}
          </Typography>
          <Typography variant="body2" className="text-blue-100">
            {quiz?.description}
          </Typography>
        </Box>

        <CardContent className="p-4 md:p-6">
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box className="flex items-center gap-2">
                <MenuBook className="text-blue-500 dark:text-blue-400" />
                <Box>
                  <Typography
                    variant="caption"
                    className="text-gray-500 dark:text-gray-400 block"
                  >
                    Course
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-medium dark:text-white"
                  >
                    {quiz?.courseId.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="flex items-center gap-2">
                <Timer className="text-amber-500 dark:text-amber-400" />
                <Box>
                  <Typography
                    variant="caption"
                    className="text-gray-500 dark:text-gray-400 block"
                  >
                    Duration
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-medium dark:text-white"
                  >
                    {quiz?.duration} minutes
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="flex items-center gap-2">
                <SignalCellularAlt className="text-green-500 dark:text-green-400" />
                <Box>
                  <Typography
                    variant="caption"
                    className="text-gray-500 dark:text-gray-400 block"
                  >
                    Level
                  </Typography>
                  <Chip
                    label={quiz?.level}
                    size="small"
                    color={
                      quiz?.level === "Beginner"
                        ? "success"
                        : quiz?.level === "Intermediate"
                        ? "primary"
                        : "error"
                    }
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="flex items-center gap-2">
                <Help className="text-purple-500 dark:text-purple-400" />
                <Box>
                  <Typography
                    variant="caption"
                    className="text-gray-500 dark:text-gray-400 block"
                  >
                    Questions
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-medium dark:text-white"
                  >
                    {quiz?.questions?.length || 0} questions
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Timer */}
      {quizStarted && (
        <Box className="mb-6">
          <Typography variant="h6" className="dark:text-white">
            Time Left: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </Typography>
        </Box>
      )}
      {/* Submit Quiz Button - Only in student mode */}
{previewMode === "student" && quizStarted && (
  <Box className="flex justify-center mt-6">
    <Button
      variant="contained"
      color="primary"
      onClick={async () => {
        setQuizStarted(false); // Stop the quiz
        await submitQuizResult(); // Submit the quiz
        toast.success("Quiz submitted successfully!");
      }}
    >
      Submit Quiz
    </Button>
  </Box>)}

      {/* Active Question Preview */}
      {(previewMode === "admin" || quizStarted) &&
        quiz?.questions &&
        quiz.questions.length > 0 && (
          <Card className="shadow-lg dark:bg-slate-800 border-t-4 border-blue-500 dark:border-blue-600">
            <CardContent className="p-4 md:p-6">
              {/* Question */}
              <Paper
                elevation={0}
                className="p-5 mb-6 dark:bg-slate-700 border-l-4 border-blue-500 dark:border-blue-600"
              >
                <Typography
                  variant="body1"
                  className="font-medium dark:text-white text-lg"
                >
                  {quiz.questions[activeQuestion].question}
                </Typography>
              </Paper>

              {/* Options */}
              <Typography
                variant="subtitle1"
                className="mb-3 dark:text-white font-medium"
              >
                Select the correct answer:
              </Typography>

              <Box className="mb-6 space-y-3">
                {quiz.questions[activeQuestion].options.map(
                  (option: string, index: number) => (
                    <Paper
                      key={index}
                      elevation={0}
                      onClick={() => handleOptionSelect(index)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer 
      hover:border-blue-400 dark:hover:border-blue-500 
      ${
        selectedOption === index
          ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30"
          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      } 
      ${
        previewMode === "admin" &&
        showAnswers &&
        quiz.questions[activeQuestion].correctAnswer === index
          ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30"
          : ""
      }`}
                      sx={{
                        pointerEvents:
                          previewMode === "student" && isQuestionSubmitted
                            ? selectedOption === index
                              ? "auto"
                              : "none"
                            : "auto",
                        opacity:
                          previewMode === "student" && isQuestionSubmitted
                            ? selectedOption === index
                              ? 1
                              : 0.5
                            : 1,
                      }}
                    >
                      <Box className="flex items-center w-full">
                        <Box
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 
          ${
            selectedOption === index
              ? "bg-blue-500 dark:bg-blue-600 text-white"
              : previewMode === "admin" &&
                showAnswers &&
                quiz.questions[activeQuestion].correctAnswer === index
              ? "bg-green-500 dark:bg-green-600 text-white"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
                        >
                          {selectedOption === index ||
                          (previewMode === "admin" &&
                            showAnswers &&
                            quiz.questions[activeQuestion].correctAnswer ===
                              index) ? (
                            <CheckCircle fontSize="small" />
                          ) : (
                            <Typography variant="body2" className="font-medium">
                              {String.fromCharCode(65 + index)}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          className={`text-gray-900 dark:text-gray-200 font-medium 
          ${
            selectedOption === index
              ? "text-blue-700 dark:text-blue-300"
              : previewMode === "admin" &&
                showAnswers &&
                quiz.questions[activeQuestion].correctAnswer === index
              ? "text-green-700 dark:text-green-300"
              : "dark:text-gray-300"
          }`}
                        >
                          {option}
                        </Typography>

                        {previewMode === "admin" &&
                          showAnswers &&
                          quiz.questions[activeQuestion].correctAnswer ===
                            index && (
                            <Chip
                              label="Correct Answer"
                              size="small"
                              color="success"
                              className="ml-auto"
                              icon={<CheckCircle fontSize="small" />}
                            />
                          )}
                      </Box>
                    </Paper>
                  )
                )}
              </Box>

              {/* Submit Button - Only in student mode */}
              {previewMode === "student" && !isQuestionSubmitted && (
                <Box className="flex justify-center mt-6">
                  <Button
                    variant="contained"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                  >
                    Submit Answer
                  </Button>
                </Box>
              )}

              {/* Result feedback - only in student mode and when an option is selected */}
              {previewMode === "student" && isQuestionSubmitted && (
                <Box
                  className={`p-4 rounded-lg mb-6 ${
                    selectedOption ===
                    quiz.questions[activeQuestion].correctAnswer
                      ? "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800"
                      : "bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800"
                  }`}
                >
                  <Box className="flex items-start gap-3">
                    {selectedOption ===
                    quiz.questions[activeQuestion].correctAnswer ? (
                      <CheckCircle className="text-green-500 mt-1" />
                    ) : (
                      <Close className="text-red-500 mt-1" />
                    )}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        className={`font-medium ${
                          selectedOption ===
                          quiz.questions[activeQuestion].correctAnswer
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {selectedOption ===
                        quiz.questions[activeQuestion].correctAnswer
                          ? "Correct!"
                          : "Incorrect!"}
                      </Typography>
                      {selectedOption !==
                        quiz.questions[activeQuestion].correctAnswer && (
                        <Typography
                          variant="body2"
                          className="text-gray-700 dark:text-gray-300 mt-1"
                        >
                          The correct answer is:{" "}
                          <span className="font-medium">
                            {
                              quiz.questions[activeQuestion].options[
                                quiz.questions[activeQuestion].correctAnswer
                              ]
                            }
                          </span>
                        </Typography>
                      )}
                      {quiz.questions[activeQuestion].explanation && (
                        <Button
                          startIcon={<Lightbulb />}
                          variant="text"
                          size="small"
                          onClick={() => setExplanationOpen(true)}
                          className="mt-2 text-blue-600 dark:text-blue-400"
                        >
                          View Explanation
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Admin mode explanation - Only visible when showAnswers is true */}
              {previewMode === "admin" &&
                showAnswers &&
                quiz.questions[activeQuestion].explanation && (
                  <Box className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6 border border-blue-200 dark:border-blue-800">
                    <Box className="flex items-center gap-2 mb-2">
                      <Lightbulb className="text-amber-500" />
                      <Typography
                        variant="subtitle1"
                        className="font-medium dark:text-white"
                      >
                        Explanation:
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="dark:text-gray-300">
                      {quiz.questions[activeQuestion].explanation}
                    </Typography>
                  </Box>
                )}

              {/* Navigation buttons */}
              <Box className="flex justify-between mt-6">
                <Button
                  variant="outlined"
                  disabled={activeQuestion === 0}
                  onClick={handlePrevQuestion}
                  startIcon={<NavigateBefore />}
                  className="px-4"
                >
                  Previous
                </Button>

                <Box className="flex gap-2">
                  {previewMode === "admin" && (
                    <Button
                      variant="outlined"
                      onClick={() => setShowAnswers(!showAnswers)}
                      startIcon={
                        showAnswers ? <VisibilityOff /> : <Visibility />
                      }
                      sx={{
                        color: showAnswers ? "primary.main" : "green",
                        borderColor: showAnswers ? "primary.main" : "green",
                        "&:hover": {
                          borderColor: showAnswers
                            ? "primary.dark"
                            : "darkgreen",
                        },
                      }}
                    >
                      {showAnswers ? "Hide Answers" : "Show Answers"}
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    disabled={activeQuestion === quiz.questions.length - 1}
                    onClick={handleNextQuestion}
                    endIcon={<NavigateNext />}
                    className="px-4"
                  >
                    Next
                  </Button>
                </Box>
              </Box>
              
            </CardContent>
          </Card>
          
        )}
    </Box>
  );
};

export default PreviewQuiz;
