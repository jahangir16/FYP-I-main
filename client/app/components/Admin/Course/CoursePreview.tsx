"use client";

import type React from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import dynamic from "next/dynamic";

// Lazy load SingleVideoPlayer
const SingleVideoPlayer = dynamic(
  () => import("@/app/utils/SingleVideoPLayer"),
  { ssr: false }
);

interface CourseData {
  name?: string;
  description?: string;
  price?: number;
  estimatedPrice?: number;
  demoUrl?: string;
  benefits?: { title: string }[];
  prerequisites?: { title: string }[];
  courseData?: any[];
  thumbnail?: string;
}

interface Props {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  courseData: CourseData;
  handleCourseCreate: (e: React.FormEvent) => void;
  isEdit?: boolean;
}

const CoursePreview: React.FC<Props> = ({
  active,
  setActive,
  courseData,
  handleCourseCreate,
  isEdit = false,
}) => {
  // Calculate discount percentage
  const discountPercentage =
    courseData?.estimatedPrice && courseData?.price
      ? ((courseData.estimatedPrice - courseData.price) /
          courseData.estimatedPrice) *
        100
      : 0;

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCourseCreate({} as React.FormEvent);
  };

  return (
    <div className="w-full max-w-4xl m-auto h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide p-3 mt-24">
      {/* Video Player at the top */}
      <div className="w-full mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        <SingleVideoPlayer
          videoUrl={courseData?.demoUrl || ""}
          title={courseData?.name || ""}
        />
      </div>

      {/* Course Title and Price */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 dark:text-white">
            {courseData?.name}
          </h1>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold dark:text-white">
              {courseData?.price === 0 ? "Free" : `$${courseData?.price}`}
            </h2>
            {courseData?.estimatedPrice && courseData?.estimatedPrice > 0 && (
              <>
                <h5 className="ml-3 text-lg line-through opacity-70 dark:text-gray-400">
                  ${courseData?.estimatedPrice}
                </h5>
                <span className="ml-3 px-2 py-1 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                  {discountPercentage.toFixed(0)}% Off
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Course Details
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {courseData?.description}
        </p>
      </div>

      {/* Course Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* What you will learn */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            What you will learn
          </h2>
          <div className="space-y-3">
            {courseData?.benefits?.map((item: any, index: number) => (
              <div className="flex items-start" key={index}>
                <IoCheckmarkDoneOutline className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <p className="dark:text-white">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Prerequisites
          </h2>
          <div className="space-y-3">
            {courseData?.prerequisites?.map((item: any, index: number) => (
              <div className="flex items-start" key={index}>
                <IoCheckmarkDoneOutline className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <p className="dark:text-white">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Includes */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          This course includes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start">
            <IoCheckmarkDoneOutline className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <p className="dark:text-white">Source code included</p>
          </div>
          <div className="flex items-start">
            <IoCheckmarkDoneOutline className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <p className="dark:text-white">Full lifetime access</p>
          </div>
          <div className="flex items-start">
            <IoCheckmarkDoneOutline className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <p className="dark:text-white">Certificate of completion</p>
          </div>
          <div className="flex items-start">
            <IoCheckmarkDoneOutline className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <p className="dark:text-white">Premium Support</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 mb-8">
        <button
          onClick={prevButton}
          className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
        >
          Previous
        </button>
        <button
          onClick={createCourse}
          className="flex-1 py-3 px-6 bg-[#37a39a] hover:bg-[#2c8a82] text-white font-medium rounded-lg transition-colors"
        >
          {isEdit ? "Update Course" : "Create Course"}
        </button>
      </div>
    </div>
  );
};

export default CoursePreview;
