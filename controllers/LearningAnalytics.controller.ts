import { Request, Response } from "express";
import QuizResultModel from "../models/quizResults.model";
import VideoProgressModel from "../models/videoProgress.model";
import CourseModel from "../models/course.model";
import mongoose from "mongoose";

export const getLearningAnalytics = async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId as string;

    // Validate studentId
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing Student ID" });
    }

    const objectId = new mongoose.Types.ObjectId(studentId);

    // Fetch quiz results
    const quizResults = await QuizResultModel.find({
      studentId: objectId,
    }).lean();

    if (!quizResults.length) {
      return res.status(404).json({
        success: false,
        message: "No quiz results found for the student.",
      });
    }

    // Fetch video progress
    const videoProgress = await VideoProgressModel.find({
      userId: objectId,
    }).lean();

    if (!videoProgress.length) {
      return res.status(404).json({
        success: false,
        message: "No video progress data found for the student.",
      });
    }

    // Extract quiz courseIds and videoIds from progress
    const quizCourseIds = quizResults
      .map((quiz) => quiz.courseId?.toString())
      .filter(Boolean);
    const videoIdsSet = new Set(videoProgress.map((vp) => vp.videoId));

    // Fetch all courses
    const allCourses = await CourseModel.find({}).lean();

    // Filter only courses related to quizResults or videoProgress
    const courses = allCourses.filter(
      (course) =>
        quizCourseIds.includes(course._id.toString()) ||
        course.courseData?.some((video) =>
          videoIdsSet.has(video._id.toString())
        )
    );
    // Debugging: Log the courses array
    // console.log("Courses:", courses);

    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No course data found for the student.",
      });
    }

    // Map courseId to name
    const courseMap = new Map(
      courses.map((course) => [course._id.toString(), course.name])
    );

    // // Map videoId to video title
    // const videoIdToTitleMap = new Map<string, string>();
    // courses.forEach((course) => {
    //   course.courseData?.forEach((video) => {
    //     videoIdToTitleMap.set(video._id.toString(), video.title);
    //   });
    // });

    // Process quiz results to group by topic
    const topicScores: Record<
      string,
      { totalScore: number; totalCount: number }
    > = {};

    quizResults.forEach((quiz) => {
      const topic = courseMap.get(quiz.courseId.toString());
      if (!topic) return;

      const score = quiz.marksObtained / quiz.totalMarks;

      if (topicScores[topic]) {
        topicScores[topic].totalScore += score;
        topicScores[topic].totalCount += 1;
      } else {
        topicScores[topic] = { totalScore: score, totalCount: 1 };
      }
    });

    // Topic breakdown
    const topicBreakdown = Object.keys(topicScores).map((topic) => {
      const { totalScore, totalCount } = topicScores[topic];
      return {
        name: topic,
        score: totalScore / totalCount,
      };
    });

    // Video progress formatting
    const processedVideoProgress = videoProgress.map((video) => ({
      date: new Date(video.createdAt).toISOString().split("T")[0],
      completion: video.totalPercentWatched / 100,
    }));

    // Engagement metrics
    const avgWatchTime = videoProgress.length
      ? `${Math.round(
          videoProgress.reduce(
            (sum, video) => sum + (video.watchDuration || 0),
            0
          ) / videoProgress.length
        )} min`
      : "0 min";

    const completionRate = videoProgress.length
      ? `${Math.round(
          (videoProgress.filter((v) => v.completed).length /
            videoProgress.length) *
            100
        )}%`
      : "0%";

    const averageQuizScore = quizResults.length
      ? `${Math.round(
          (quizResults.reduce(
            (sum, quiz) => sum + quiz.marksObtained / quiz.totalMarks,
            0
          ) /
            quizResults.length) *
            100
        )}%`
      : "0%";

    const engagementMetrics = {
      avgWatchTime,
      completionRate,
      quizAttemptRate: `${Math.round((quizResults.length / 10) * 100)}%`,
      averageQuizScore,
    };

    // Recommendations
    const recommendations = [];

    // Build videoId => title map using courseData._id.toString()
    // Build videoId => title map using courseData.videoUrl
    const videoIdToTitleMap = new Map<string, string>();

    courses.forEach((course) => {
      course.courseData?.forEach((video) => {
        const videoUrl = video.videoUrl; // Use videoUrl instead of _id
        if (videoUrl) {
          videoIdToTitleMap.set(videoUrl, video.title); // Map videoUrl to title
        }
      });
    });

    // Debugging: Log the videoIdToTitleMap
    console.log("Video ID to Title Map:", videoIdToTitleMap);

    // Match watched videos with titles (ensure videoId is string)
    const lowEngagementTopics = videoProgress
      .filter((video) => {
        const videoId = video.videoId?.toString(); // Ensure videoId is a string
        const existsInMap = videoId && videoIdToTitleMap.has(videoId);
        if (!existsInMap) {
          console.log(`Video ID not found in map: ${videoId}`);
        }
        return video.totalPercentWatched < 50 && existsInMap;
      })
      .map((video) => {
        const videoId = video.videoId?.toString(); // Ensure videoId is a string
        return videoIdToTitleMap.get(videoId) || "Unknown Title";
      });

    // Debugging: Log the low engagement topics
    console.log("Low Engagement Topics:", lowEngagementTopics);

    // Clean up titles (remove "Unknown", deduplicate)
    const uniqueLowTopics = [...new Set(lowEngagementTopics)].filter(
      (title) => title !== "Unknown Title"
    );
    // Debugging: Log the unique low engagement topics
    console.log("Unique Low Engagement Topics:", uniqueLowTopics);

    // Push recommendation if we have valid titles
    if (uniqueLowTopics.length > 0) {
      recommendations.push({
        type: "video_engagement",
        message: `Try watching videos for topics like ${uniqueLowTopics.join(
          ", "
        )} without interruption`,
        priority: "medium",
      });
    }
    topicBreakdown.forEach((topic) => {
      if (topic.score < 0.7) {
        recommendations.push({
          type: "quiz_improvement",
          message: `Focus on improving in ${topic.name}`,
          priority: "high",
        });
      }
    });

    // const lowEngagementTopics = videoProgress
    //   .filter((video) => video.totalPercentWatched < 50 && video.videoId)
    //   .map((video) => videoIdToTitleMap.get(video.videoId) || "Unknown Title");

    // if (lowEngagementTopics.length > 0) {
    //   recommendations.push({
    //     type: "video_engagement",
    //     message: `Try watching videos for topics like ${lowEngagementTopics.join(
    //       ", "
    //     )} without interruption`,
    //     priority: "medium",
    //   });
    // }

    // Final response
    const responseData = {
      videoProgress: processedVideoProgress,
      quizResults: quizResults.map((quiz) => ({
        date: new Date(quiz.attemptedOn).toISOString().split("T")[0],
        score: quiz.marksObtained / quiz.totalMarks,
      })),
      topicBreakdown,
      engagementMetrics,
      recommendations,
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching learning analytics:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
