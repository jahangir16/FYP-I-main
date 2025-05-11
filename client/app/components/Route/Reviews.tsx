import { styles } from "@/app/styles/style";
import Image from "next/image";
import React, { useState } from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Gene Bates",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Student | Cambridge university",
    comment:
      "I had the pleasure of exploring EDUvibe, a website that provides an extensive range of courses on various tech-related topics. I was thoroughly impressed with my experience, as the website offers a comprehensive selection of courses that cater to different skill levels and interests. If you're looking to enhance your knowledge and skills in the tech industry, I highly recommend checking out EDUvibe!",
  },
  {
    name: "Verna Santos",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Full stack developer | Quarter ltd.",
    comment:
      "Thanks for your amazing programming tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse programming languages and topics is truly impressive. The practical applications and real-world examples you incorporate reinforce the theoretical knowledge and provide valuable insights. Your engagement with the audience fosters a supportive learning environment. Thank you for your dedication, expertise, and passion for teaching programming, and keep up the fantastic work!",
  },
  {
    name: "Jay Gibbs",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "Computer systems engineering student | Zimbabwe",
    comment:
      "Thanks for your amazing programming tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse programming languages and topics is truly impressive. The practical applications and real-world examples you incorporate reinforce the theoretical knowledge and provide valuable insights. Your engagement with the audience fosters a supportive learning environment. Thank you for your dedication, expertise, and passion for teaching programming, and keep up the fantastic work!",
  },
  {
    name: "Mina Davidson",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Junior Web Developer | Indonesia",
    comment:
      "I had the pleasure of exploring EDUvibe, a website that provides an extensive range of courses on various tech-related topics. I was thoroughly impressed with my experience",
  },
  {
    name: "Rosemary Smith",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    profession: "Full stack web developer | Algeria",
    comment:
      "Your content is very special. The thing I liked the most is that the videos are so long, which means they cover everything in details. for that any person had beginner-level can complete an integrated project when he watches the videos. Thank you very much. Im very excited for the next videos Keep doing this amazing work",
  },
  {
    name: "Laura Mckenzie",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    profession: "Full stack web developer | Canada",
    comment:
      "Join EDUvibe! EDUvibe focuses on practical applications rather than just teaching the theory behind programming languages or frameworks. I took a lesson on creating a web marketplace using React JS, and it was very helpful in teaching me the different stages involved in creating a project from start to finish. Overall, I highly recommend EDUvibe to anyone looking to improve their programming skills and build practical projects. EDUvibe is a great resource that will help you take your skills to the next level.",
  },
];

const Reviews = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 4;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const displayedReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <Image
                src={
                  require("../../../public/assests/business-img.png") ||
                  "/placeholder.svg"
                }
                alt="Students learning"
                width={700}
                height={700}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Students Are{" "}
              <span className="text-gradient">Our Strength</span> <br /> See
              What They Say About Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Our students&apos; success stories inspire us to continue
              providing high-quality education. Their feedback helps us improve
              and create better learning experiences for everyone.
            </p>

            {/* Testimonial Navigation */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentPage === 0
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 shadow-md"
                }`}
                aria-label="Previous testimonials"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentPage === totalPages - 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 shadow-md"
                }`}
                aria-label="Next testimonials"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {displayedReviews.map((item, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:translate-y-[-8px]"
            >
              <ReviewCard item={item} />
            </div>
          ))}
        </div>

        {/* Mobile Pagination */}
        <div className="mt-10 flex justify-center items-center gap-2 md:hidden">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2.5 h-2.5 rounded-full ${
                currentPage === index
                  ? "bg-blue-600 dark:bg-blue-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
