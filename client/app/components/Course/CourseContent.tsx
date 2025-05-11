import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import dynamic from "next/dynamic";
import GenerateStudentCertificate from "../Certificate/GenerateStudentCertificate";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
// Lazy load heavy components
const CourseContentMedia = dynamic(() => import("./CourseContentMedia"), {
  ssr: false,
});
const CourseContentList = dynamic(() => import("./CourseContentList"), {
  ssr: false,
});

type Props = {
  id: string;
  user: any;
};

const CourseContent = ({ id, user }: Props) => {
  const {
    data: courseDetails,
    isLoading,
    refetch,
  } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const data = courseDetails?.course?.courseData;
  const course = courseDetails?.course;

  const [activeVideo, setActiveVideo] = useState(0);

  // Temporary boolean state to simulate video completion
  const [isVideoCompleteWatch, setIsVideoCompleteWatch] = useState(true);

  // State to control the certificate modal
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            activeItem={1}
            open={open}
            setOpen={setOpen}
            route={route}
            setRoute={setRoute}
          />
          <div className="w-full grid 800px:grid-cols-10">
            <Heading
              title={data[activeVideo]?.title}
              description="anything"
              keywords={data[activeVideo]?.tags}
            />
            <div className="col-span-7">
              <CourseContentMedia
                data={data}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                user={user}
                refetch={refetch}
              />
            </div>
            <div className="hidden 800px:block 800px:col-span-3">
              <CourseContentList
                setActiveVideo={setActiveVideo}
                data={data}
                id={id}
                user={user}
                activeVideo={activeVideo}
              />
            </div>
          </div>

          {/* Conditionally render the "Get Certificate" button */}
          {isVideoCompleteWatch && (
            <div className="fixed bottom-10 right-10 z-50">
              <button
                onClick={() => setShowCertificateModal(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all"
              >
                Get Certificate
              </button>
            </div>
          )}

          {/* Certificate Modal */}
          {showCertificateModal && (
            <GenerateStudentCertificate
              userName={user.name}
              userId={user._id}
              courseName={course?.name}
              courseLevel={course?.level}
              date={new Date().toLocaleDateString()}
              onClose={() => setShowCertificateModal(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default CourseContent;
