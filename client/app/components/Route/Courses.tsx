import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

type Props = {};

const Courses = (props: Props) => {
  const { data: userData, isLoading: userLoading } = useLoadUserQuery(); // Fetch user data
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]); // State for enrolled courses
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("allCourses"); // State for active tab
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  // Fetch all courses and filter enrolled courses
  useEffect(() => {
    if (data?.courses) {
      setCourses(data.courses);

      // Filter enrolled courses for the user
      if (userData?.user?.courses) {
        const userEnrolledCourses = data.courses.filter((course: any) =>
          userData.user.courses.some(
            (userCourse: any) => userCourse._id === course._id
          )
        );
        setEnrolledCourses(userEnrolledCourses);
      }

      // Set initial filtered courses
      setFilteredCourses(data.courses);
    }
  }, [data, userData?.user?.courses]);

  // Get unique categories
  const categories = courses
    ? [
        "all",
        ...new Set(
          courses
            .map((course) => course.categories || "uncategorized")
            .filter((category) => category.trim() !== "")
        ),
      ]
    : ["all"];

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredCourses(
        activeTab === "allCourses" ? courses : enrolledCourses
      );
    } else {
      setFilteredCourses(
        (activeTab === "allCourses" ? courses : enrolledCourses).filter(
          (course) => course.categories === category
        )
      );
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "allCourses") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(enrolledCourses);
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Expand Your Career{" "}
            <span className="text-gradient">Opportunity</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our collection of high-quality courses designed to help you
            advance in your career
          </p>
        </div>

        {/* Tabs for All Courses and My Courses */}
        {userData && (
          <div className="mb-10">
            <Tabs
              defaultValue="allCourses"
              className="w-full"
              onValueChange={handleTabChange}
            >
              <div className="flex justify-center">
                <TabsList className="scrollbar-hide bg-white dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap max-w-full scrollbar-hide">
                  <TabsTrigger
                    value="allCourses"
                    className="px-4 py-2 rounded-full capitalize"
                  >
                    All Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="myCourses"
                    className="px-4 py-2 rounded-full capitalize"
                  >
                    My Courses
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        )}

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="mb-10">
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={handleCategoryChange}
            >
              <div className="flex justify-center">
                <TabsList className="scrollbar-hide bg-white dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap max-w-full scrollbar-hide">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="px-4 py-2 rounded-full capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || userLoading) && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* No Courses State */}
        {!isLoading && !userLoading && filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn&apos;t find any courses in this category. Please try
              another category.
            </p>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((item: any, index: number) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:translate-y-[-8px]"
            >
              <CourseCard item={item} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        {filteredCourses.length > 0 && (
          <div className="mt-12 text-center">
            <a
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              View All Courses
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Courses;
