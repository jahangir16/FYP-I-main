import Link from "next/link";
import React from "react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaYoutube,
} from "react-icons/fa";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-12 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                EDU<span className="text-blue-600">vibe</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Empowering learners worldwide with cutting-edge education in
              programming, technology, and digital skills.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/shah"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.github.com/shah"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.youtube.com/channel/shah"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/courses"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/course-dashboard"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Course Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FaEnvelope
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
                <span className="text-gray-600 dark:text-gray-400">
                  hello@EDUvibe.com
                </span>
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                Call Us: 1-885-665-2022
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                7011 Vermont Ave, Los Angeles, CA 90044
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Subscribe to Our Newsletter
          </h3>
          <form className="max-w-md mx-auto">
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} EDUvibe | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
