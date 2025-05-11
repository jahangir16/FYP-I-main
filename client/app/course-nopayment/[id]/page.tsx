"use client";
import React from "react";
import dynamic from "next/dynamic";
// Lazy load CourseDetailsPageFree
const CourseDetailsPageFree = dynamic(
  () => import("@/app/components/Course/CourseDetailsPageFree"),
  { ssr: false }
);
const Page = ({ params }: any) => {
  return (
    <div>
      <CourseDetailsPageFree id={params.id} />
    </div>
  );
};

export default Page;
