import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model"; // Import User Model

export interface IVideoProgress extends Document {
  userId: IUser;
  videoId: string;
  sessionId: string; // 🆕 Add sessionId
  watchDuration: number;
  totalDuration: number;
  seekCount: number;
  pauseCount: number;
  totalPercentWatched: number;
  completed: boolean;
  skipped: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoProgressSchema = new Schema<IVideoProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videoId: { type: String, required: true },
    sessionId: { type: String, required: true }, // 🆕 Required session ID
    watchDuration: { type: Number, required: true },
    totalDuration: { type: Number, required: true },
    seekCount: { type: Number, default: 0 },
    pauseCount: { type: Number, default: 0 },
    totalPercentWatched: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    skipped: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IVideoProgress>(
  "VideoProgress",
  VideoProgressSchema
);

// import mongoose, { Document, Schema, Model } from "mongoose";
// import { IUser } from "./user.model"; // Import User Model
// import { ICourseData } from "./course.model"; // Import CourseData Model

// // Define Video Progress Interface
// export interface IVideoProgress extends Document {
//   user: IUser; // User who is watching
//   courseId: mongoose.Schema.Types.ObjectId; // Course ID
//   video: ICourseData; // Video being watched
//   watchedPercentage: number; // Progress (0-100)
//   updatedAt: Date; // Auto-updated timestamp
// }

// // Define Video Progress Schema
// const videoProgressSchema = new Schema<IVideoProgress>(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     courseId: {
//       type: Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     video: {
//       type: Schema.Types.ObjectId,
//       ref: "Course.courseData", // Reference to courseData (Videos)
//       required: true,
//     },
//     watchedPercentage: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//   },
//   { timestamps: true } // Auto-manage createdAt & updatedAt
// );

// // Create Video Progress Model
// const VideoProgressModel: Model<IVideoProgress> = mongoose.model(
//   "VideoProgress",
//   videoProgressSchema
// );

// export default VideoProgressModel;
