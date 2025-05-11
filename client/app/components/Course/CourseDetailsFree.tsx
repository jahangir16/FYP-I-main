import { styles } from "@/app/styles/style";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import dynamic from "next/dynamic";
const SingleVideoPlayer = dynamic(
  () => import("@/app/utils/SingleVideoPLayer"),
  { ssr: false }
);
const Ratings = dynamic(() => import("@/app/utils/Ratings"), { ssr: false });
const CourseContentList = dynamic(() => import("../Course/CourseContentList"), {
  ssr: false,
});

type Props = {
  data: any;
  setRoute: any;
  setOpen: any;
};

const CourseDetailsFree = ({
  data,
  setRoute,
  setOpen: openAuthModal,
}: Props) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();

  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data.purchased} Students
              </h5>
            </div>

            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you will learn from this course?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
            <br />
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              Course Overview
            </h1>
            <CourseContentList
              data={data?.courseData}
              isDemo={true}
              id={data?.id}
              user={user}
            />
            <br />
            <br />
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <SingleVideoPlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  Free
                </h1>
              </div>
              <div className="flex items-center">
                <Link
                  className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                  href={`/course-free-acess/${data._id}`}
                >
                  Start Learning
                </Link>
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">
                • Source code included
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Full lifetime access
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Certificate of completion
              </p>
              <p className="pb-3 800px:pb-1 text-black dark:text-white">
                • Premium Support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsFree;
