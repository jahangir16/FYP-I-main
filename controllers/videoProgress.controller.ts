import { Request, Response } from "express";
import VideoProgress from "../models/videoProgress.model";
import mongoose from "mongoose";

export const trackVideoProgress = async (req: Request, res: Response) => {
  console.log("trackVideoProgress called");
  console.log("Headers:", JSON.stringify(req.headers));
  console.log("Body:", JSON.stringify(req.body));

  try {
    const {
      userId,
      videoId,
      sessionId, // NEW
      watchDuration,
      totalDuration,
      seekCount,
      pauseCount,
      totalPercentWatched,
      skipped,
      completed,
    } = req.body;

    // Basic validations
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!videoId) missingFields.push("videoId");
    if (!sessionId) missingFields.push("sessionId"); // NEW
    if (watchDuration === undefined) missingFields.push("watchDuration");
    if (totalPercentWatched === undefined)
      missingFields.push("totalPercentWatched");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Always create a new record per session
    const progress = await VideoProgress.create({
      userId,
      videoId,
      sessionId,
      watchDuration,
      totalDuration: totalDuration || 0,
      seekCount: seekCount || 0,
      pauseCount: pauseCount || 0,
      totalPercentWatched,
      skipped: skipped || false,
      completed: completed || false,
    });

    return res.status(201).json({
      success: true,
      message: "Progress tracked (new session).",
      data: progress,
    });
  } catch (error) {
    console.error("Error tracking video progress:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// GET progress for a user and video
export const getVideoProgress = async (req: Request, res: Response) => {
  try {
    const { userId, videoId } = req.query;

    if (!userId || !videoId) {
      return res
        .status(400)
        .json({ message: "userId and videoId are required" });
    }

    const progress = await VideoProgress.findOne({
      userId: new mongoose.Types.ObjectId(userId as string),
      videoId: videoId as string,
    });

    if (!progress) {
      return res.status(404).json({ message: "No progress found." });
    }

    return res.status(200).json({ data: progress });
  } catch (error) {
    console.error("Error fetching video progress:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
