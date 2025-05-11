import express from "express";
import {
  addAnwser,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getVdoCipherOTP,
  getAdminAllCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  getSingleCourseAdmin,
  generateVideoUrl,
  uploadCourse,
  enrollStudent,
  unenrollStudent,
  trackVideoProgress,
  getVideoProgress,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get(
  "/get-course-admin/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getSingleCourseAdmin
);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get(
  "/get-admin-courses",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminAllCourses
);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", isAuthenticated, addQuestion);

courseRouter.put("/add-answer", isAuthenticated, addAnwser);

courseRouter.put("/add-review/:id", isAuthenticated, addReview);

courseRouter.put(
  "/add-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.post("/getVdoCipherOTP", getVdoCipherOTP);

courseRouter.post("/generateVideoUrl", generateVideoUrl);
courseRouter.post("/trackVideoProgress", trackVideoProgress);
courseRouter.post("/getVideoProgress/:videoId", getVideoProgress);
courseRouter.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

courseRouter.put("/enroll-student/:id", isAuthenticated, enrollStudent);
courseRouter.put("/unenroll-student/:id", isAuthenticated, unenrollStudent);
export default courseRouter;
