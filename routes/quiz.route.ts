// src/routes/quiz.route.ts
import express from "express";
import { isAuthenticated } from "../middleware/auth";
const quizRouter = express.Router();
import {
  uploadQuiz,
  getQuizzes,
  deleteQuiz,
  getQuizById,
  updateQuiz,
  saveQuizResult,
} from "../controllers/quiz.controller";

quizRouter.post("/create-quiz", isAuthenticated, uploadQuiz);
// Get all quizzes
quizRouter.get("/", isAuthenticated, getQuizzes);
// Get a quiz by ID
quizRouter.get("/:id", isAuthenticated, getQuizById);

// Update a quiz
quizRouter.put("/:id", isAuthenticated, updateQuiz);

// Delete a quiz
quizRouter.delete("/:id", isAuthenticated, deleteQuiz);
//save Quiz result
quizRouter.post("/quiz-result", isAuthenticated, saveQuizResult);
export default quizRouter;
