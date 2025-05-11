"use client";

import type React from "react";
import { useState } from "react";
import { useGetCourseDetailsAdminQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useAddAnswerInQuestionMutation } from "@/redux/features/courses/coursesApi";
import {
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaReply,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";
const SingleVideoPlayer = dynamic(
  () => import("@/app/utils/SingleVideoPLayer"),
  { ssr: false }
);

type Props = {
  id: string;
};

interface Question {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  question: string;
  questionReplies?: {
    user: {
      name: string;
      avatar?: string;
    };
    answer: string;
  }[];
}

interface Review {
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  _id: string;
}

interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  questions?: Question[];
  documents?: {
    name: string;
    file: string;
    type: string;
  }[];
}

const PreviewCourseAsAdmin: React.FC<Props> = ({ id }) => {
  const { theme } = useTheme();
  const { data, isLoading, error, refetch } = useGetCourseDetailsAdminQuery(id);
  const [activeVideo, setActiveVideo] = useState(0);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const [addAnswerInQuestion, { isLoading: answerLoading }] =
    useAddAnswerInQuestionMutation();

  const handleAddReply = async () => {
    if (!answer) {
      toast.error("Reply cannot be empty!");
      return;
    }
    try {
      await addAnswerInQuestion({
        answer,
        courseId: id,
        contentId: data?.course?.courseData[activeVideo]?._id,
        questionId,
      });
      toast.success("Reply added successfully!");
      setAnswer("");
      setIsReply(false);
      refetch();
    } catch (error) {
      toast.error("Failed to add reply.");
    }
  };

  const handleCancelReply = () => {
    setIsReply(false);
    setAnswer("");
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }

    return stars;
  };

  if (isLoading) return <Loader />;
  if (error) {
    toast.error("Failed to load course details.");
    return (
      <div className="text-center mt-8 text-red-500 dark:text-red-400">
        Something went wrong loading this course.
      </div>
    );
  }

  const course = data?.course;
  if (!course) {
    return <div className="text-center mt-8">Course not found.</div>;
  }

  const videos = course.courseData;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto h-[calc(100vh-100px)] scrollbar-hide mt-24">
      <div className="p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {course.name}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {course.description || "No description available."}
        </p>

        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        {/* Video Player */}
        {videos?.length > 0 && (
          <div className="mb-6">
            <SingleVideoPlayer
              title={videos[activeVideo].title}
              videoUrl={videos[activeVideo].videoUrl}
            />
          </div>
        )}

        {/* Video Navigation */}
        <div className="flex justify-between my-6">
          <button
            disabled={activeVideo === 0}
            onClick={() => setActiveVideo((prev) => prev - 1)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeVideo === 0
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            }`}
          >
            <FaChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <button
            disabled={activeVideo === videos.length - 1}
            onClick={() => setActiveVideo((prev) => prev + 1)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeVideo === videos.length - 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            }`}
          >
            Next
            <FaChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {videos[activeVideo]?.documents?.length > 0 && (
          <div className="my-8">
            <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Lecture Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos[activeVideo].documents.map(
                (
                  doc: { name: string; file: string; type: string },
                  docIndex: number
                ) => (
                  <a
                    key={docIndex}
                    href={`${doc.file}?fl_attachment=true`}
                    download
                    className="block"
                  >
                    <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="mr-3 text-2xl">
                        {doc.type.includes("pdf") ? (
                          <FaFilePdf className="w-7 h-7 text-red-500" />
                        ) : doc.type.includes("doc") ? (
                          <FaFileWord className="w-7 h-7 text-blue-500" />
                        ) : doc.type.includes("ppt") ? (
                          <FaFilePowerpoint className="w-7 h-7 text-orange-500" />
                        ) : (
                          <FaFileAlt className="w-7 h-7 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <FaDownload className="w-3 h-3 mr-1" />
                          Click to download
                        </p>
                      </div>
                    </div>
                  </a>
                )
              )}
            </div>
          </div>
        )}

        {/* Questions & Answers Section */}
        {videos[activeVideo]?.questions?.length > 0 && (
          <div className="my-8">
            <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Questions & Answers
            </h2>
            <div className="space-y-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg">
              {videos[activeVideo].questions.map(
                (q: Question, qIndex: number) => (
                  <div
                    key={qIndex}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/80 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {q.user.name} asked:
                      </div>
                      <div>
                        {expandedQuestion === q._id ? (
                          <FaChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <FaChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedQuestion === q._id && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {q.question}
                        </p>

                        {/* Question Replies */}
                        {(q.questionReplies ?? []).length > 0 && (
                          <div className="ml-6 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4 mb-4">
                            {(q.questionReplies ?? []).map(
                              (reply, replyIndex) => (
                                <div key={replyIndex} className="mb-2">
                                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                    {reply.user?.name} replied:
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {reply.answer}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* Add Reply Section */}
                        {isReply && questionId === q._id ? (
                          <div className="mt-4">
                            <textarea
                              rows={2}
                              placeholder="Type your reply here..."
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleAddReply}
                                disabled={answerLoading}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                              >
                                {answerLoading ? "Submitting..." : "Submit"}
                              </button>
                              <button
                                onClick={handleCancelReply}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setIsReply(true);
                              setQuestionId(q._id);
                            }}
                            className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:underline"
                          >
                            <FaReply className="w-3 h-3 mr-1" />
                            Reply
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {course.reviews && course.reviews.length > 0 && (
          <div className="my-8">
            <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Student Reviews
            </h2>
            <div className="space-y-4">
              {course.reviews.map((review: Review, index: number) => (
                <div
                  key={review._id || index}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {review.user.avatar ? (
                        <Image
                          src={review.user.avatar.url || "/placeholder.svg"}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <FaUser className="text-blue-500 dark:text-blue-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {review.user.name}
                        </h3>
                        <div className="flex mt-1 sm:mt-0">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewCourseAsAdmin;
