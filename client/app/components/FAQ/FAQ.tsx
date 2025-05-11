"use client";

import { useEffect, useState } from "react";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};

const FAQ = (props: Props) => {
  const { data } = useGetHeroDataQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout?.faq);
    }
  }, [data]);

  const toggleQuestion = (id: any) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  // Sample questions if API doesn't return any
  const sampleQuestions = [
    {
      _id: "1",
      question: "How do I enroll in a course?",
      answer:
        "Enrolling in a course is easy! Simply browse our course catalog, select the course you're interested in, and click the 'Enroll' button. You'll be guided through the payment process, and once completed, you'll have immediate access to the course materials.",
    },
    {
      _id: "2",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and in some regions, bank transfers. All payments are securely processed and your financial information is never stored on our servers.",
    },
    {
      _id: "3",
      question: "Can I access courses on mobile devices?",
      answer:
        "Yes! Our platform is fully responsive and works on all devices including smartphones, tablets, laptops, and desktop computers. You can learn on the go with our mobile-friendly interface.",
    },
    {
      _id: "4",
      question: "Do courses have a time limit?",
      answer:
        "Once you enroll in a course, you have lifetime access to the course materials. There's no deadline to complete a course, allowing you to learn at your own pace and revisit the content whenever you need a refresher.",
    },
  ];

  const displayQuestions =
    questions && questions.length > 0 ? questions : sampleQuestions;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Frequently Asked{" "}
            <span className="text-blue-600 dark:text-blue-400">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our platform, courses, and
            learning experience
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayQuestions.map((q, index) => (
              <div key={q._id} className="group">
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                  aria-expanded={activeQuestion === q._id ? "true" : "false"}
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {q.question}
                  </span>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === q._id ? (
                      <HiMinus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <HiPlus className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeQuestion === q._id ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-base text-gray-600 dark:text-gray-300">
                    {q.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions? We&apos;re here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Contact Support
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
