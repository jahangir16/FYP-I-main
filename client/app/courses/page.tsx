"use client";
import type React from "react";
import { type FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams, useRouter } from "next/navigation";
import Loader from "../components/Loader/Loader";
import dynamic from "next/dynamic";
import Heading from "../utils/Heading";
import Image from "next/image";
import CourseCard from "../components/Course/CourseCard";

// Lazy load components
const Footer = dynamic(() => import("../components/Footer"), {
  ssr: false,
});
const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

type Props = {};

const Page: FC<Props> = (props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: categoriesData } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data?.courses) {
      let filteredCourses = [...data.courses];

      // Apply category filter
      if (category !== "All") {
        filteredCourses = filteredCourses.filter(
          (course) => course.categories === category
        );
      }

      // Apply search filter
      if (search) {
        filteredCourses = filteredCourses.filter((course) =>
          course.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setCourses(filteredCourses);

      // Set featured courses (top 3 by ratings)
      if (data.courses.length > 0) {
        const sorted = [...data.courses].sort((a, b) => b.ratings - a.ratings);
        setFeaturedCourses(sorted.slice(0, 3));
      }
    }
  }, [data, category, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchTerm ? `?title=${searchTerm}` : "");
  };

  const categories = categoriesData?.layout?.categories || [];

  const stats = [
    { icon: "📚", value: data?.courses?.length || "50+", label: "Courses" },
    { icon: "👨‍💻", value: "10K+", label: "Students" },
    { icon: "⭐", value: "4.8", label: "Rating" },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <Heading
            title={"All courses - EDUvibe"}
            description={"EDUvibe is a programming community."}
            keywords={
              "programming community, coding skills, expert insights, collaboration, growth"
            }
          />

          {/* Hero Section */}
          <div
            className={`relative overflow-hidden ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-900 to-purple-900"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            } py-20 text-white`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() * 300}px`,
                      height: `${Math.random() * 300}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Discover Your <span className="text-yellow-300">Perfect</span>{" "}
                  Course
                </h1>
                <p className="text-lg md:text-xl mb-8 text-blue-100">
                  Elevate your programming skills with EDUvibe&apos;s expert-led
                  courses. Join thousands of successful developers in our
                  community.
                </p>

                {/* Search Bar */}
                <form
                  onSubmit={handleSearch}
                  className="relative max-w-2xl mx-auto mb-8"
                >
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </div>
                    <input
                      type="text"
                      placeholder="Search for courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full h-14 pl-12 pr-32 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-blue-400 outline-none ${
                        theme === "dark"
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 mt-10">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`${
                          theme === "dark" ? "bg-gray-800" : "bg-white/10"
                        } p-3 rounded-full mb-2 text-2xl`}
                      >
                        {stat.icon}
                      </div>
                      <span className="text-3xl font-bold">{stat.value}</span>
                      <span className="text-blue-200">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
              <svg
                className="relative block w-full h-[40px] md:h-[60px]"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className={
                    theme === "dark" ? "fill-gray-900" : "fill-gray-50"
                  }
                ></path>
              </svg>
            </div>
          </div>

          {/* Featured Courses Section */}
          {featuredCourses.length > 0 && (
            <section
              className={`py-16 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                  <h2
                    className={`text-3xl font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Featured{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      Courses
                    </span>
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    } max-w-2xl mx-auto`}
                  >
                    Our highest-rated courses chosen by thousands of satisfied
                    students
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredCourses.map((course: any, index: number) => (
                    <div
                      key={index}
                      className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-white"
                      } rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={
                            course.thumbnail?.url ||
                            "/placeholder.svg?height=200&width=400" ||
                            "/placeholder.svg"
                          }
                          alt={course.name}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-md flex items-center">
                          ⭐ {course.ratings.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-6">
                        <div
                          className={`text-sm ${
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          } font-semibold mb-2`}
                        >
                          {course.categories}
                        </div>
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {course.name}
                        </h3>
                        <p
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          } mb-4 line-clamp-2`}
                        >
                          {course.description ||
                            "Learn the essential skills and concepts in this comprehensive course."}
                        </p>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-lg font-bold ${
                              theme === "dark"
                                ? "text-blue-400"
                                : "text-blue-600"
                            }`}
                          >
                            ${course.price}
                          </span>
                          <button
                            onClick={() => router.push(`/course/${course._id}`)}
                            className={`${
                              theme === "dark"
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-blue-600 hover:bg-blue-700"
                            } text-white px-4 py-2 rounded-md transition-colors`}
                          >
                            View Course
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Courses Section */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-900" : "bg-gray-50"
            } py-16`}
          >
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2
                  className={`text-3xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Explore All{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    Courses
                  </span>
                </h2>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  } max-w-2xl mx-auto`}
                >
                  Browse our complete collection of high-quality programming
                  courses
                </p>
              </div>

              {/* Category Filters */}
              <div className="mb-10">
                <div className="relative">
                  <div
                    className={`flex items-center justify-between ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    } p-4 rounded-lg shadow-md mb-4 md:hidden cursor-pointer`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Filter by: {category}
                    </span>
                    <span
                      className={`transition-transform ${
                        isFilterOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>

                  <div
                    className={`md:flex flex-wrap justify-center gap-3 ${
                      isFilterOpen ? "block" : "hidden md:flex"
                    }`}
                  >
                    <button
                      className={`rounded-full px-6 py-2 m-1 ${
                        category === "All"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : theme === "dark"
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 dark:border-gray-700"
                      } transition-colors`}
                      onClick={() => setCategory("All")}
                    >
                      All
                    </button>

                    {categories.map((item: any, index: number) => (
                      <button
                        key={index}
                        className={`rounded-full px-6 py-2 m-1 ${
                          category === item.title
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : theme === "dark"
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 dark:border-gray-700"
                        } transition-colors`}
                        onClick={() => setCategory(item.title)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* No Courses Found Message */}
              {courses.length === 0 && (
                <div
                  className={`${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } rounded-lg shadow-md p-12 text-center`}
                >
                  <div className="mx-auto mb-6 text-6xl">🔍</div>
                  <h3
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    } mb-2`}
                  >
                    {search
                      ? "No matching courses found!"
                      : "No courses in this category yet!"}
                  </h3>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    } mb-6`}
                  >
                    {search
                      ? "Try adjusting your search terms or browse our categories."
                      : "Please try another category or check back soon as we're constantly adding new courses!"}
                  </p>
                  <button
                    onClick={() => {
                      setCategory("All");
                      if (search) router.push("");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    View All Courses
                  </button>
                </div>
              )}

              {/* Course Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="transform transition-all duration-300 hover:translate-y-[-8px]"
                  >
                    <CourseCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <section
            className={`${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-900 to-purple-900"
                : "bg-gradient-to-r from-blue-600 to-purple-700"
            } py-16 text-white`}
          >
            <div className="container mx-auto px-4 text-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of students already learning on EDUvibe and
                  take your skills to the next level.
                </p>
                <button
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  } px-8 py-3 rounded-md font-medium text-lg transition-colors`}
                  onClick={() => router.push("/courses")}
                >
                  Browse All Courses
                </button>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Page;
