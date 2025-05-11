"use client";

import Image from "next/image";
import {
  Code,
  School,
  Group,
  YouTube,
  TrendingUp,
  MonetizationOn,
  Lightbulb,
  RocketLaunch,
} from "@mui/icons-material";
import Link from "next/link";

const features = [
  {
    icon: <Code className="text-primary/80" />,
    title: "Expert Programming Education",
    description:
      "Comprehensive courses covering programming basics to advanced techniques.",
  },
  {
    icon: <YouTube className="text-primary/80" />,
    title: "Rich Video Content",
    description:
      "Access our extensive library of informative programming tutorials.",
  },
  {
    icon: <MonetizationOn className="text-primary/80" />,
    title: "Affordable Learning",
    description: "Quality education at accessible prices for everyone.",
  },
  {
    icon: <Group className="text-primary/80" />,
    title: "Supportive Community",
    description:
      "Join a family of like-minded programmers helping each other grow.",
  },
];

export default function About() {
  return (
    <div className="bg-dot-pattern bg-gray-50 dark:bg-gray-900 py-16 transition-colors">
      <div className="container px-4 md:px-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <School className="text-primary/80 mb-6 text-5xl" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            What is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              EDUvibe
            </span>
            ?
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
            Your gateway to programming excellence. We empower new programmers
            with affordable education, community support, and practical skills
            for success.
          </p>
        </div>
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Image Container */}
          <div className="relative h-[300px] md:h-[400px] w-full md:w-[40%] rounded-xl overflow-hidden">
            <Image
              src="/assests/about.jpeg"
              alt="Modern programming workspace with laptop showing code"
              width={500} // Fixed width
              height={300} // Fixed height
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full md:w-[60%]">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-primary/80" />
              <h2 className="text-2xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At EDUvibe, we believe in breaking down barriers to programming
              education. Founded with a vision to make quality programming
              education accessible to all, we offer comprehensive courses,
              engaging video content, and a supportive community that helps you
              grow from beginner to professional.
            </p>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary/80" />
              <h2 className="text-2xl font-semibold">Your Growth</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Whether you&apos;re starting your programming journey or advancing
              your skills, EDUvibe provides the resources, guidance, and
              community support you need. Our affordable courses and extensive
              video library ensure you have everything required to succeed in
              the programming industry.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
                hover:shadow-xl transition-shadow group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div
            className="inline-flex items-center gap-2 text-2xl font-semibold 
            text-primary/80 mb-6"
          >
            <RocketLaunch />
            <span>Ready to Start Your Journey?</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Join the EDUvibe family today and transform your programming career.
            With our affordable courses, expert guidance, and supportive
            community, success is within your reach.
          </p>
          <Link
            href="/"
            className="bg-primary/90 hover:bg-primary text-white px-8 py-3 
            rounded-full font-semibold shadow-lg hover:shadow-xl 
            transition-all duration-300 transform hover:-translate-y-1"
          >
            Join EDUvibe Today
          </Link>
        </div>
      </div>
    </div>
  );
}
