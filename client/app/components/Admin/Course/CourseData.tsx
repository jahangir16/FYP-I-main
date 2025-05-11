"use client";

import React, { FC, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const [activeSection, setActiveSection] = useState<
    "benefits" | "prerequisites"
  >("benefits");

  const handleBenefitChange = (index: number, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index: number, value: string) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill all the fields to proceed!");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className="text-[25px] font-Poppins font-[600] dark:text-white">
          Course Benefits & Prerequisites
        </h1>
      </div>

      <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-lg mb-4">
        <div className="flex w-full mb-4">
          <button
            className={`w-1/2 p-2 ${
              activeSection === "benefits"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            } rounded-l-lg`}
            onClick={() => setActiveSection("benefits")}
          >
            Benefits
          </button>
          <button
            className={`w-1/2 p-2 ${
              activeSection === "prerequisites"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            } rounded-r-lg`}
            onClick={() => setActiveSection("prerequisites")}
          >
            Prerequisites
          </button>
        </div>

        {activeSection === "benefits" && (
          <div>
            <label className={`${styles.label} text-[20px]`}>
              What are the benefits for students in this course?
            </label>
            {benefits.map((benefit: any, index: number) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  name="Benefit"
                  placeholder="You will be able to build a full stack LMS Platform..."
                  required
                  className={`${styles.input} flex-grow mr-2`}
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                />
                {index > 0 && (
                  <AiOutlineDelete
                    className="text-red-500 cursor-pointer"
                    size={20}
                    onClick={() => {
                      const newBenefits = benefits.filter(
                        (_, i) => i !== index
                      );
                      setBenefits(newBenefits);
                    }}
                  />
                )}
              </div>
            ))}
            <AiOutlinePlusCircle
              className="my-2 cursor-pointer text-blue-500"
              size={25}
              onClick={handleAddBenefit}
            />
          </div>
        )}

        {activeSection === "prerequisites" && (
          <div>
            <label className={`${styles.label} text-[20px]`}>
              What are the prerequisites for starting this course?
            </label>
            {prerequisites.map((prerequisite: any, index: number) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  name="prerequisites"
                  placeholder="You need basic knowledge of MERN stack"
                  required
                  className={`${styles.input} flex-grow mr-2`}
                  value={prerequisite.title}
                  onChange={(e) =>
                    handlePrerequisitesChange(index, e.target.value)
                  }
                />
                {index > 0 && (
                  <AiOutlineDelete
                    className="text-red-500 cursor-pointer"
                    size={20}
                    onClick={() => {
                      const newPrerequisites = prerequisites.filter(
                        (_, i) => i !== index
                      );
                      setPrerequisites(newPrerequisites);
                    }}
                  />
                )}
              </div>
            ))}
            <AiOutlinePlusCircle
              className="my-2 cursor-pointer text-blue-500"
              size={25}
              onClick={handleAddPrerequisites}
            />
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
