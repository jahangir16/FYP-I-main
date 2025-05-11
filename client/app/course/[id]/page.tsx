"use client";
import React from "react";
import dynamic from "next/dynamic";
import Loader from "../../components/Loader/Loader";
// Lazy load CourseDetailsPage
const CourseDetailsPage = dynamic(
  () => import("../../components/Course/CourseDetailsPage"),
  {
    loading: () => <Loader />, // Show Loader while CourseDetailsPage loads
    ssr: false,
  }
);

const Page = ({ params }: any) => {
  return (
    <div>
      <CourseDetailsPage id={params.id} />
    </div>
  );
};

export default Page;
