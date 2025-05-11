"use client";

import { useEffect, useState } from "react";
import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from "react-icons/fa";

type Props = {};

const EditFaq = (props: Props) => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(Array.isArray(data.layout?.faq) ? data.layout.faq : []);
    }
    if (layoutSuccess) {
      toast.success("FAQ updated successfully");
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, layoutSuccess, error]);

  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        _id: Date.now().toString(),
        question: "",
        answer: "",
        active: true,
      },
    ]);
  };

  const areQuestionsUnchanged = (
    originalQuestions: any[],
    newQuestions: any[]
  ) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (questions: any[]) => {
    return questions.some((q) => q.question === "" || q.answer === "");
  };

  const handleEdit = async () => {
    if (data?.layout?.faq) {
      if (
        !areQuestionsUnchanged(data.layout.faq, questions) &&
        !isAnyQuestionEmpty(questions)
      ) {
        await editLayout({
          type: "FAQ",
          faq: questions,
        });
      }
    }
  };

  // Calculate `canSave` only if `data` is defined
  const canSave =
    data?.layout?.faq &&
    !areQuestionsUnchanged(data.layout.faq, questions) &&
    !isAnyQuestionEmpty(questions);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-10 mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h1>

            <div className="space-y-6">
              {questions?.map((q: any, index: number) => (
                <div
                  key={q._id}
                  className={`${
                    index !== 0
                      ? "border-t border-gray-200 dark:border-gray-700 pt-6"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <input
                      className="flex-1 px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(q._id, e.target.value)
                      }
                      placeholder="Add your question..."
                    />
                    <div className="flex items-center ml-3">
                      <button
                        onClick={() => toggleQuestion(q._id)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        aria-label={q.active ? "Collapse" : "Expand"}
                      >
                        {q.active ? (
                          <FaChevronUp className="w-5 h-5" />
                        ) : (
                          <FaChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {q.active && (
                    <div className="mt-4 flex items-start">
                      <textarea
                        className="flex-1 px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] resize-none"
                        value={q.answer}
                        onChange={(e) =>
                          handleAnswerChange(q._id, e.target.value)
                        }
                        placeholder="Add your answer..."
                      />
                      <button
                        onClick={() => {
                          setQuestions((prevQuestions) =>
                            prevQuestions.filter((item) => item._id !== q._id)
                          );
                        }}
                        className="ml-3 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="Delete FAQ"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={newFaqHandler}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 z-10">
            <button
              onClick={canSave ? handleEdit : () => null}
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all ${
                canSave
                  ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              disabled={!canSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
