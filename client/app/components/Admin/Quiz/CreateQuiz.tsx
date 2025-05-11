"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import {
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useGetQuizByIdQuery,
} from "../../../../redux/features/quiz/quizApi";
import { useGetAllCoursesQuery } from "../../../../redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "../../../../redux/features/layout/layoutApi";
import {
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
} from "@mui/material";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { useRouter, useSearchParams } from "next/navigation";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  marks: number; // Added marks field
};

type Quiz = {
  title: string;
  description: string;
  duration: number;
  courseId: string;
  questions: QuizQuestion[];
  category: string;
  level: string;
};

const initialQuizState: Quiz = {
  title: "",
  description: "",
  duration: 10,
  courseId: "",
  questions: [
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      marks: 1, // Default marks for each question
    },
  ],
  category: "",
  level: "Beginner",
};

const CreateQuiz: React.FC = () => {
  const { theme: currentTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const edit = searchParams ? searchParams.get("edit") : null; // Extract the `edit` query parameter
  const [quiz, setQuiz] = useState<Quiz>(initialQuizState);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);

  // Fetch quiz data if in edit mode
  const {
    data: quizData,
    isLoading: isQuizLoading,
    isError: isQuizError,
  } = useGetQuizByIdQuery(edit as string, {
    skip: !edit, // Skip fetching if not in edit mode
  });

  // Mutations for creating and updating quizzes
  const [createQuiz, { isLoading: isCreatingQuiz }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdatingQuiz }] = useUpdateQuizMutation();

  // Fetch all courses
  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useGetAllCoursesQuery({});

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  // Extract courses and categories from the fetched data
  const courses = coursesData?.courses || [];
  const categories = categoriesData?.layout?.categories || [];

  // Pre-fill the form if in edit mode
  useEffect(() => {
    if (quizData && edit) {
      setQuiz({
        title: quizData.quiz.title,
        description: quizData.quiz.description,
        duration: quizData.quiz.duration,
        courseId: quizData.quiz.courseId._id,
        category: quizData.quiz.category,
        questions: quizData.quiz.questions,
        level: quizData.quiz.level,
      });
    }
  }, [quizData, edit]);

  const handleQuizChange = (field: keyof Quiz, value: any) => {
    setQuiz((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionChange = (field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[activeQuestion] = {
      ...updatedQuestions[activeQuestion],
      [field]: value,
    };
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const updatedQuestions = [...quiz.questions];
    const updatedOptions = [...updatedQuestions[activeQuestion].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[activeQuestion].options = updatedOptions;

    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const addNewQuestion = () => {
    if (!quiz.questions[activeQuestion].question.trim()) {
      toast.error("Please fill the current question first!");
      return;
    }

    const newQuestion: QuizQuestion = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      marks: 1, // Default marks for new questions
    };

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    setActiveQuestion(quiz.questions.length);
  };

  const removeQuestion = (index: number) => {
    if (quiz.questions.length <= 1) {
      toast.error("Quiz must have at least one question!");
      return;
    }

    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));

    if (activeQuestion >= updatedQuestions.length) {
      setActiveQuestion(updatedQuestions.length - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!quiz.title.trim()) {
      toast.error("Quiz title is required!");
      return;
    }

    if (!quiz.courseId) {
      toast.error("Please select a course for this quiz!");
      return;
    }

    for (const question of quiz.questions) {
      if (!question.question.trim()) {
        toast.error("All questions must have content!");
        return;
      }

      for (const option of question.options) {
        if (!option.trim()) {
          toast.error("All options must have content!");
          return;
        }
      }

      if (question.marks <= 0) {
        toast.error("Marks for each question must be greater than 0!");
        return;
      }
    }

    try {
      if (edit) {
        // Update quiz
        const response = await updateQuiz({
          id: edit as string,
          data: quiz,
        }).unwrap();
        toast.success(response.message || "Quiz updated successfully!");
      } else {
        // Create quiz
        const response = await createQuiz(quiz).unwrap();
        toast.success(response.message || "Quiz created successfully!");
      }

      // Redirect to quizzes page after successful submission
      router.push("/admin/quiz-history");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to submit quiz");
    }
  };

  return (
    <ThemeProvider
      theme={createTheme({
        palette: { mode: currentTheme === "dark" ? "dark" : "light" },
      })}
    >
      <CssBaseline />
      <Box
        className="p-4 md:p-6 max-w-4xl mx-auto overflow-y-auto h-[calc(100vh-100px)] scrollbar-hide"
        sx={{
          bgcolor: currentTheme === "dark" ? "#0f172a" : "inherit",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          className="mb-6"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
          }}
        >
          {edit ? "Edit Quiz" : "Create New Quiz"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Quiz Details */}
          <Card className="mb-8 dark:bg-slate-800">
            <CardContent className="p-4 md:p-6">
              <Typography variant="h6" className="mb-4">
                Quiz Details
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                <TextField
                  label="Quiz Title"
                  fullWidth
                  value={quiz.title}
                  onChange={(e) => handleQuizChange("title", e.target.value)}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          currentTheme === "dark"
                            ? "#4b5563"
                            : "rgba(0, 0, 0, 0.23)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                    },
                  }}
                />

                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          currentTheme === "dark"
                            ? "#4b5563"
                            : "rgba(0, 0, 0, 0.23)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                    },
                  }}
                >
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={quiz.courseId}
                    onChange={(e) =>
                      handleQuizChange("courseId", e.target.value)
                    }
                    required
                    label="Course"
                    disabled={isCoursesLoading || isCoursesError}
                  >
                    {isCoursesLoading ? (
                      <MenuItem value="" disabled>
                        Loading courses...
                      </MenuItem>
                    ) : isCoursesError ? (
                      <MenuItem value="" disabled>
                        Failed to load courses
                      </MenuItem>
                    ) : (
                      courses.map((course: { _id: string; name: string }) => (
                        <MenuItem key={course._id} value={course._id}>
                          {course.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4">
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  fullWidth
                  value={quiz.duration}
                  onChange={(e) =>
                    handleQuizChange(
                      "duration",
                      Number.parseInt(e.target.value) || 10
                    )
                  }
                  required
                  inputProps={{ min: 1 }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          currentTheme === "dark"
                            ? "#4b5563"
                            : "rgba(0, 0, 0, 0.23)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                    },
                  }}
                />

                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          currentTheme === "dark"
                            ? "#4b5563"
                            : "rgba(0, 0, 0, 0.23)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                    },
                  }}
                >
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    value={quiz.level}
                    onChange={(e) => handleQuizChange("level", e.target.value)}
                    required
                    label="Difficulty Level"
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          currentTheme === "dark"
                            ? "#4b5563"
                            : "rgba(0, 0, 0, 0.23)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                    },
                  }}
                >
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={quiz.category}
                    onChange={(e) =>
                      handleQuizChange("category", e.target.value)
                    }
                    label="Category"
                    disabled={isCategoriesLoading || isCategoriesError}
                  >
                    {isCategoriesLoading ? (
                      <MenuItem value="" disabled>
                        Loading categories...
                      </MenuItem>
                    ) : isCategoriesError ? (
                      <MenuItem value="" disabled>
                        Failed to load categories
                      </MenuItem>
                    ) : (
                      categories.map(
                        (category: { _id: string; title: string }) => (
                          <MenuItem key={category._id} value={category.title}>
                            {category.title}
                          </MenuItem>
                        )
                      )
                    )}
                  </Select>
                </FormControl>
              </div>

              <TextField
                label="Quiz Description"
                fullWidth
                multiline
                rows={3}
                value={quiz.description}
                onChange={(e) =>
                  handleQuizChange("description", e.target.value)
                }
                className="mb-4"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor:
                        currentTheme === "dark"
                          ? "#4b5563"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Questions Navigator */}
          <Box className="mb-6 flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <Chip
                key={index}
                label={`Q${index + 1}`}
                color={activeQuestion === index ? "primary" : "default"}
                onClick={() => setActiveQuestion(index)}
                onDelete={
                  quiz.questions.length > 1
                    ? () => removeQuestion(index)
                    : undefined
                }
                deleteIcon={<AiOutlineDelete />}
                className="text-md font-medium cursor-pointer"
              />
            ))}

            <IconButton color="primary" onClick={addNewQuestion}>
              <AiOutlinePlusCircle size={24} />
            </IconButton>
          </Box>

          {/* Active Question */}
          <Card className="mb-8 dark:bg-slate-800">
            <CardContent className="p-4 md:p-6">
              <Typography variant="h6" className="mb-4">
                Question {activeQuestion + 1}
              </Typography>

              <TextField
                label="Question"
                fullWidth
                multiline
                rows={2}
                value={quiz.questions[activeQuestion].question}
                onChange={(e) =>
                  handleQuestionChange("question", e.target.value)
                }
                required
                className="mb-6"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor:
                        currentTheme === "dark"
                          ? "#4b5563"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                  },
                }}
              />

              <Typography
                variant="subtitle1"
                className="mb-2"
                sx={{
                  color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                  fontWeight: 500,
                }}
              >
                Options
              </Typography>

              <div className="space-y-4 mb-6">
                {quiz.questions[activeQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        quiz.questions[activeQuestion].correctAnswer === index
                          ? "bg-green-500"
                          : currentTheme === "dark"
                          ? "bg-gray-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    <TextField
                      fullWidth
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      required
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "0.375rem",
                          backgroundColor:
                            currentTheme === "dark"
                              ? alpha("#ffffff", 0.05)
                              : "inherit",
                        },
                        "& .MuiInputBase-input": {
                          color:
                            currentTheme === "dark" ? "#f3f4f6" : "inherit",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor:
                              currentTheme === "dark"
                                ? "#4b5563"
                                : "rgba(0, 0, 0, 0.23)",
                          },
                        },
                      }}
                    />

                    <Button
                      variant="contained"
                      color={
                        quiz.questions[activeQuestion].correctAnswer === index
                          ? "success"
                          : "primary"
                      }
                      onClick={() =>
                        handleQuestionChange("correctAnswer", index)
                      }
                      className="min-w-[120px] mt-2 sm:mt-0"
                      sx={{
                        minWidth: { xs: "100%", sm: "120px" },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      {quiz.questions[activeQuestion].correctAnswer === index
                        ? "Correct ✓"
                        : "Mark Correct"}
                    </Button>
                  </div>
                ))}
              </div>

              <TextField
                label="Explanation (shown after answering)"
                fullWidth
                multiline
                rows={2}
                value={quiz.questions[activeQuestion].explanation}
                onChange={(e) =>
                  handleQuestionChange("explanation", e.target.value)
                }
                className="mb-4"
                sx={{
                  mb: 2,
                  "& .MuiInputLabel-root": {
                    color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor:
                        currentTheme === "dark"
                          ? "#4b5563"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                  },
                }}
              />

              <TextField
                label="Marks"
                type="number"
                fullWidth
                value={quiz.questions[activeQuestion].marks}
                onChange={(e) =>
                  handleQuestionChange("marks", Number(e.target.value) || 1)
                }
                required
                inputProps={{ min: 1 }}
                className="mb-4"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: currentTheme === "dark" ? "#9ca3af" : "inherit",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor:
                        currentTheme === "dark"
                          ? "#4b5563"
                          : "rgba(0, 0, 0, 0.23)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: currentTheme === "dark" ? "#f3f4f6" : "inherit",
                  },
                }}
              />
            </CardContent>
          </Card>

          <Box className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setQuiz(initialQuizState);
                setActiveQuestion(0);
              }}
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isCreatingQuiz || isUpdatingQuiz || isCoursesLoading}
            >
              {isCreatingQuiz || isUpdatingQuiz ? (
                <CircularProgress size={24} />
              ) : edit ? (
                "Update Quiz"
              ) : (
                "Create Quiz"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default CreateQuiz;
