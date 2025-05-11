// src/controllers/quiz.controller.ts
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import QuizModel from "../models/quiz.model";
import QuizResultModel from "../models/quizResults.model";

// Upload Quiz Controller
export const uploadQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        description,
        duration,
        courseId,
        questions,
        category,
        level,
      } = req.body;

      // Validate required fields
      if (
        !title ||
        !description ||
        !courseId ||
        !questions ||
        !category ||
        !level
      ) {
        return next(
          new ErrorHandler("Please provide all required fields", 400)
        );
      }

      // Validate that each question has a `marks` field
      const isValidQuestions = questions.every(
        (question: any) => question.marks !== undefined
      );
      if (!isValidQuestions) {
        return next(
          new ErrorHandler("Each question must have a `marks` field", 400)
        );
      }

      // Create the quiz in the database
      const quiz = await QuizModel.create({
        title,
        description,
        duration,
        courseId,
        questions,
        category,
        level,
        // `attempts`, `status`, and `dateCreated` will use their default values from the schema
      });

      // Send success response
      res.status(201).json({
        success: true,
        message: "Quiz created successfully!",
        quiz,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getQuizzes = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Fetching quizzes..."); // Debugging
      const quizzes = await QuizModel.find()
        .populate({
          path: "courseId",
          select: "name", // Only fetch the 'name' field from the CourseModel
        })
        .sort({ createdAt: -1 });

      console.log("Quizzes fetched:", quizzes); // Debugging

      // Map the quizzes to include the courseName
      const quizzesWithCourseName = quizzes.map((quiz) => ({
        ...quiz.toObject(),
        courseName: (quiz.courseId as any).name, // Add courseName from the populated courseId
      }));

      res.status(200).json({
        success: true,
        quizzes: quizzesWithCourseName,
      });
    } catch (error: any) {
      console.error("Error in getQuizzes:", error); // Debugging
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getQuizById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const quiz = await QuizModel.findById(id).populate({
        path: "courseId",
        select: "name", // Only include the course name field from the CourseModel
      });

      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }

      res.status(200).json({
        success: true,
        quiz,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Update a quiz
export const updateQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      // Validate the incoming data
      if (!data || Object.keys(data).length === 0) {
        return next(new ErrorHandler("No data provided for update", 400));
      }

      // Find and update the quiz
      const quiz = await QuizModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Quiz updated successfully",
        quiz,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// Delete a quiz
export const deleteQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const quiz = await QuizModel.findByIdAndDelete(id);
      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Quiz deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//save result
export const saveQuizResult = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        studentId,
        quizId,
        courseId,
        marksObtained,
        totalMarks,
        questionResults,
      } = req.body;

      // Create a new quiz result document
      const quizResult = new QuizResultModel({
        studentId,
        quizId,
        courseId,
        marksObtained,
        totalMarks,
        questionResults,
      });

      // Save the quiz result to the database
      const savedResult = await quizResult.save();

      // Send a success response
      res.status(201).json({
        message: "Quiz result saved successfully",
        data: savedResult,
      });
    } catch (error) {
      console.error("Error saving quiz result:", error);
      res.status(500).json({
        message: "Failed to save quiz result",
      });
    }
  }
);
