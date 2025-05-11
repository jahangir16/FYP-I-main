import express from "express";
import {
  trackVideoProgress,
  getVideoProgress,
} from "../controllers/videoProgress.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const videoProgress = express.Router();

// POST /trackVideoProgress
videoProgress.post("/trackVideoProgress", isAuthenticated, trackVideoProgress);
videoProgress.post("/track-no-auth", trackVideoProgress);
videoProgress.get("/getVideoProgress", isAuthenticated, getVideoProgress);
export default videoProgress;
