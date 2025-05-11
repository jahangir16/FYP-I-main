"use client";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";
import img1 from "../../../public/assests/banner-img-1.png";

type Props = {};

const Hero: FC<Props> = (props) => {
  const { data, isLoading } = useGetHeroDataQuery("Banner", {});
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search === "") {
      return;
    } else {
      router.push(`/courses?title=${search}`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[40vh] left-5 w-[40vh] hero_animation rounded-[50%] 1100px:left-8 1500px:left-14"></div>
            <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-400 dark:bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
            {/* Flex container for image and content */}
            <div className="flex flex-col lg:flex-row items-center">
              {/* Image Section (Left Side) */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full filter blur-3xl opacity-20 scale-110 animate-pulse"></div>
                  <Image
                    src={data?.layout?.banner?.image?.url || img1}
                    width={600}
                    height={600}
                    alt="Learning illustration"
                    className="relative z-10 w-[80%] md:w-[70%] lg:w-[90%] max-w-lg mx-auto drop-shadow-xl"
                    priority
                  />
                </div>
              </div>

              {/* Content Section (Right Side) */}
              <div className="w-full lg:w-1/2 text-center lg:text-left mt-12 lg:mt-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  {data?.layout?.banner?.title || (
                    <>
                      Unlock Your{" "}
                      <span className="text-blue-600">Potential</span> With
                      Online Learning
                    </>
                  )}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                  {data?.layout?.banner?.subTitle ||
                    "Discover thousands of courses taught by industry experts and take your skills to the next level."}
                </p>

                {/* Search Bar */}
                <div className="mt-8 max-w-md mx-auto lg:mx-0">
                  <div className="relative flex items-center">
                    <input
                      type="search"
                      placeholder="Search Courses..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-14 pl-5 pr-16 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-1 top-1 h-12 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                      aria-label="Search"
                    >
                      <BiSearch size={24} />
                    </button>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <div className="flex -space-x-2">
                    <Image
                      src={
                        require("../../../public/assests/client-1.jpg") ||
                        "/placeholder.svg"
                      }
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                    <Image
                      src={
                        require("../../../public/assests/client-2.jpg") ||
                        "/placeholder.svg"
                      }
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                    <Image
                      src={
                        require("../../../public/assests/client-3.jpg") ||
                        "/placeholder.svg"
                      }
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    <span className="text-blue-600 font-bold">500K+</span>{" "}
                    people already trusted us.{" "}
                    <Link
                      href="/courses"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline underline-offset-2"
                    >
                      View Courses
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  200+
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Courses</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  50K+
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Students</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform col-span-2 md:col-span-1">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  4.8/5
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Average Rating
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
