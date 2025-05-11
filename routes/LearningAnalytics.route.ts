import express from "express";
import { getLearningAnalytics } from "../controllers/LearningAnalytics.controller";

const LearningAnalytics = express.Router();

LearningAnalytics.get("/analytics", getLearningAnalytics);

export default LearningAnalytics;
