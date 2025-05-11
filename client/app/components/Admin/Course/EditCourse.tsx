"use client";
import type React from "react";
import { type FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy load heavy components
const CoursePreview = dynamic(() => import("./CoursePreview"), { ssr: false });
const CourseContent = dynamic(() => import("./CourseContent"), { ssr: false });

// Define shared interfaces to ensure consistency
interface Link {
  title: string;
  url: string;
}

interface CourseContentItem {
  videoUrl: string;
  title: string;
  description: string;
  videoSection: string;
  videoLength?: string;
  links: Link[];
  suggestion?: string;
  dragActive?: boolean;
  documents?: { name: string; type: string; size: number; file: string }[];
}

interface Benefit {
  title: string;
}

interface Prerequisite {
  title: string;
}

interface CourseInfo {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  tags: string;
  level: string;
  categories: string;
  demoUrl: string;
  thumbnail: string;
}

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  const [editCourse, { isSuccess, error, isLoading }] = useEditCourseMutation();
  const { data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const editCourseData = data && data.courses.find((i: any) => i._id === id);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Updated successfully");
      redirect("/admin/my-courses");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      } else {
        toast.error("An error occurred while updating the course.");
      }
    }
  }, [isSuccess, error]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (editCourseData) {
      setCourseInfo({
        name: editCourseData.name,
        description: editCourseData.description,
        price: editCourseData.price,
        estimatedPrice: editCourseData?.estimatedPrice,
        tags: editCourseData.tags,
        level: editCourseData.level,
        categories: editCourseData.categories,
        demoUrl: editCourseData.demoUrl,
        thumbnail: editCourseData?.thumbnail?.url,
      });
      setBenefits(editCourseData.benefits);
      setPrerequisites(editCourseData.prerequisites);
      setCourseContentData(editCourseData.courseData);
    }
  }, [editCourseData]);

  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: "",
    description: "",
    price: 0,
    estimatedPrice: 0,
    tags: "",
    level: "",
    categories: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState<Benefit[]>([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([
    { title: "" },
  ]);
  const [courseContentData, setCourseContentData] = useState<
    CourseContentItem[]
  >([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);

  const [courseData, setCourseData] = useState<any>({});

  const handleSubmit = async () => {
    // Format benefits array
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    // Format prerequisites array
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    // Format course content array
    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
        documents: courseContent.documents?.map((doc) => ({
          name: doc.name,
          type: doc.type,
          size: doc.size,
          file: doc.file,
        })),
      })
    );

    // Prepare the data object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      categories: courseInfo.categories,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContent: formattedCourseContentData,
    };

    setCourseData(data);
  };

  const handleCourseCreate = async () => {
    const data = courseData;
    if (!isLoading) {
      await editCourse({ id: editCourseData?._id, data });
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}

        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}

        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}

        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
            isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-10 top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;
