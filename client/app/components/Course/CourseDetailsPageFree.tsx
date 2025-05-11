import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import dynamic from "next/dynamic";
// Lazy-load components
const Loader = dynamic(() => import("../Loader/Loader"), { ssr: false });
const Heading = dynamic(() => import("@/app/utils/Heading"), { ssr: false });
const Header = dynamic(() => import("../Header"), { ssr: false });
const Footer = dynamic(() => import("../Footer"), { ssr: false });
const CourseDetailsFree = dynamic(() => import("./CourseDetailsFree"), {
  ssr: false,
});
type Props = {
  id: string;
};

const CourseDetailsPageFree = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: userData } = useLoadUserQuery(undefined, {});

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data?.course?.name + " - EDUvibe"}
            description={
              "EDUvibe is a programming community which is developed by shahriar sajeeb for helping programmers"
            }
            keywords={data?.course?.tags}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <CourseDetailsFree
            data={data.course}
            setRoute={setRoute}
            setOpen={setOpen}
          />
          <Footer />
        </div>
      )}
    </>
  );
};

export default CourseDetailsPageFree;
