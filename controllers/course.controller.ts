import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel, { IComment } from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import userModel from "../models/user.model";
import axios from "axios";
import VideoProgressModel from "../models/videoProgress.model";

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      // Upload thumbnail to Cloudinary if it's a base64 string
      if (thumbnail && thumbnail.startsWith("data:image")) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else if (thumbnail && typeof thumbnail === "string") {
        // If thumbnail is already a URL, keep it as is
        data.thumbnail = {
          public_id: "existing-thumbnail",
          url: thumbnail,
        };
      } else {
        // If thumbnail is missing or invalid, remove it
        delete data.thumbnail;
      }

      // Upload documents to Cloudinary (if any)
      if (data.courseData && Array.isArray(data.courseData)) {
        for (const content of data.courseData) {
          if (content.documents && Array.isArray(content.documents)) {
            for (let i = 0; i < content.documents.length; i++) {
              let doc = content.documents[i];

              if (doc.file) {
                // If file is a File object, convert it to base64
                if (doc.file instanceof File) {
                  const base64String = await fileToBase64(doc.file);
                  const docUpload = await cloudinary.v2.uploader.upload(
                    base64String,
                    {
                      folder: "course-documents",
                      resource_type: "auto",
                    }
                  );

                  // Replace file object with Cloudinary URL
                  content.documents[i] = {
                    ...doc,
                    file: docUpload.secure_url,
                  };
                }
                // If file is a base64 string or URL, upload it directly
                else if (typeof doc.file === "string") {
                  if (
                    doc.file.startsWith("data:") ||
                    doc.file.startsWith("http")
                  ) {
                    const docUpload = await cloudinary.v2.uploader.upload(
                      doc.file,
                      {
                        folder: "course-documents",
                        resource_type: "auto",
                      }
                    );

                    content.documents[i] = {
                      ...doc,
                      file: docUpload.secure_url,
                    };
                  }
                }
              } else {
                // Remove the `file` field if it's not valid
                delete content.documents[i].file;
              }
            }
          }
        }
      }

      // Set the course creator
      if (!req.user) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      data.createdBy = req.user._id;
      // add to Redis cache
      await redis.set(data._id, JSON.stringify(data), "EX", 604800); // 7days
      // Create the course
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      const courseId = req.params.id;

      const courseData = (await CourseModel.findById(courseId)) as any;

      // Update thumbnail if provided
      if (thumbnail) {
        // If thumbnail is a base64 string, upload it to Cloudinary
        if (thumbnail.startsWith("data:image")) {
          // Delete the old thumbnail from Cloudinary
          if (courseData.thumbnail?.public_id) {
            await cloudinary.v2.uploader.destroy(
              courseData.thumbnail.public_id
            );
          }

          // Upload new thumbnail to Cloudinary
          const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: "courses",
          });

          data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
        // If thumbnail is already a URL, keep it as is
        else if (thumbnail.startsWith("https")) {
          data.thumbnail = {
            public_id: courseData?.thumbnail.public_id,
            url: thumbnail,
          };
        }
      }

      // Update documents if provided
      if (data.courseData && Array.isArray(data.courseData)) {
        for (const content of data.courseData) {
          if (content.documents && Array.isArray(content.documents)) {
            for (let i = 0; i < content.documents.length; i++) {
              let doc = content.documents[i];

              if (doc.file) {
                // If file is a base64 string, upload it to Cloudinary
                if (doc.file.startsWith("data:")) {
                  const docUpload = await cloudinary.v2.uploader.upload(
                    doc.file,
                    {
                      folder: "course-documents",
                      resource_type: "auto",
                    }
                  );

                  // Replace base64 string with Cloudinary URL
                  content.documents[i] = {
                    ...doc,
                    file: docUpload.secure_url,
                  };
                }
                // If file is already a URL, keep it as is
                else if (doc.file.startsWith("https")) {
                  content.documents[i] = {
                    ...doc,
                    file: doc.file,
                  };
                }
              } else {
                // Remove the `file` field if it's not valid
                delete content.documents[i].file;
              }
            }
          }
        }
      }

      // Update the course
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      // Update Redis cache
      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 days

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// Helper function to convert file object to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// get single course --- without purchasing --admin
export const getSingleCourseAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(courseId).select(
          "+courseData.videoUrl +courseData.suggestion +courseData.questions.questionReplies +"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// get single course --- without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses --- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content for both admin and user -- only for valid user with valid course enroll
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find((course: any) => {
        const courseIdStr = courseId?.toString(); // Ensure courseId is a string
        const courseIdMatch = course.courseId
          ? course.courseId.toString() === courseIdStr
          : false;
        const idMatch = course._id
          ? course._id.toString() === courseIdStr
          : false;

        return courseIdMatch || idMatch;
      });

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      couseContent.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${couseContent.title}`,
      });

      // save the updated course
      await course?.save();
      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer in course question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnwser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const couseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!couseContent) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const question = couseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 400));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // add this answer to our course content
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply in ${couseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: couseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      await redis.set(courseId, JSON.stringify(course), "EX", 604800);
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add review in course
interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;

      const courseId = req.params.id;

      // check if courseId already exists in userCourseList based on _id
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length; // one example we have 2 reviews one is 5 another one is 4 so math working like this = 9 / 2  = 4.5 ratings
      }

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      // create notification
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      });

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add reply in review
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies?.push(replyData);

      await course?.save();

      await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses --- only for admin
export const getAdminAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete Course --- only for admin
export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await CourseModel.findById(id);

      if (!course) {
        return next(new ErrorHandler("course not found", 404));
      }

      await course.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/// Generate video OTPs for multiple videos (Playlist)
export const getVdoCipherOTP = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoIds } = req.body; // Expecting an array of video IDs

      if (!Array.isArray(videoIds) || videoIds.length === 0) {
        return next(new ErrorHandler("Invalid videoIds format", 400));
      }

      const apiKey = process.env.VDOCIPHER_API_SECRET;
      const otpRequests = videoIds.map(async (videoId) => {
        const response = await axios.post(
          `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
          { ttl: 300 },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Apisecret ${apiKey}`,
            },
          }
        );
        return { videoId, ...response.data };
      });

      const videoData = await Promise.all(otpRequests);

      res.json({ success: true, videos: videoData });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// generate video url for single video
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        { ttl: 300 },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// 🔹 Get video progress from VdoCipher
export const getVideoProgress = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.params;
      const response = await axios.get(
        `https://dev.vdocipher.com/api/videos/${videoId}/progress`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apikey ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error: any) {
      console.error("Error fetching video progress:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Track & update video progress
export const trackVideoProgress = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId, currentTime, eventType } = req.body;

      if (!videoId || !eventType) {
        return next(new ErrorHandler("Missing required fields", 400));
      }

      console.log("Tracking Video Progress:", {
        videoId,
        eventType,
        currentTime,
      });

      // Send progress to VdoCipher API (if required)
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/progress`,
        { currentTime, eventType },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.VDOCIPHER_API_SECRET}`,
          },
        }
      );

      // Optionally, store in your database for analytics
      // await VideoProgressModel.create({ videoId, eventType, currentTime });

      res.status(200).json({ success: true, data: response.data });
    } catch (error: any) {
      console.error("Error tracking video progress:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// enroll student by using email of user and course id -- only for admin
export const enrollStudent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const courseId = req.params.id;

    try {
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Convert courseId to a string for comparison
      const stringCourseId = String(courseId);
      if (
        user.courses.some(
          (course: any) => String(course.courseId) === stringCourseId
        )
      ) {
        return next(new ErrorHandler("User already enrolled", 400));
      }
      user.courses.push({ courseId });

      // Notify user that they are enrolled by email
      const data = {
        name: user.name,
        title: course.name,
        courseLink: `${process.env.CLIENT_URL}/course-nopayment/${courseId}`,
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/course-enrollment.ejs"),
        data
      );
      await sendMail({
        email: user.email,
        subject: "Course Enrollment Confirmation",
        template: "course-enrollment.ejs",
        data,
      });
      await user.save();
      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// unenroll student from course -- only admin
export const unenrollStudent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const courseId = req.params.id;

    try {
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      if (!user.courses.some((course: any) => course.courseId === courseId)) {
        return next(new ErrorHandler("User not enrolled", 400));
      }
      user.courses = user.courses.filter(
        (course: any) => course.courseId !== courseId
      );

      // Notify user that they are unenrolled
      const data = {
        name: user.name,
        title: course.name,
        courseLink: `${process.env.CLIENT_URL}/course-nopayment/${courseId}`,
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/course-unenrollment.ejs"),
        data
      );
      await sendMail({
        email: user.email,
        subject: "Course Unenrollment Notification",
        template: "course-unenrollment.ejs",
        data,
      });
      await user.save();
      await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7days
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
