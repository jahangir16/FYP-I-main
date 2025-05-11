"use client";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import CourseContent from "@/app/components/Course/CourseContent";
type Props = {
  params: any;
};

const Page = ({ params }: Props) => {
  const id = params.id;
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data) {
      const isEnrolled = data.user.courses.some(
        (item: any) => String(item.courseId) === String(id)
      );

      if (!isEnrolled) {
        redirect("/");
      }
    }

    if (error) {
      redirect("/");
    }
  }, [data, error]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <CourseContent id={id} user={data?.user} />
    </div>
  );
};

export default Page;
