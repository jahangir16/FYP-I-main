"use client";

import type React from "react";
import { useState } from "react";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import { BsLink45Deg } from "react-icons/bs";

// Define interfaces that match the parent components
interface Link {
  title: string;
  url: string;
}

// Make sure this interface matches exactly with the parent components
interface CourseContentItem {
  videoUrl: string;
  title: string;
  description: string; // Required in parent components
  videoSection: string; // Required in parent components
  videoLength?: string;
  links: Link[];
  suggestion?: string;
  dragActive?: boolean;
  documents?: { name: string; type: string; size: number; file: string }[];
}

interface CourseContentProps {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  courseContentData: CourseContentItem[];
  setCourseContentData: React.Dispatch<
    React.SetStateAction<CourseContentItem[]>
  >;
  handleSubmit: () => void;
}

const CourseContent: React.FC<CourseContentProps> = ({
  active,
  setActive,
  courseContentData,
  setCourseContentData,
  handleSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean[]>(
    courseContentData.map(() => true)
  );
  const [activeSection, setActiveSection] = useState(0);

  const handleAddNewContent = () => {
    // Make sure all required fields are initialized
    const newContent: CourseContentItem = {
      videoUrl: "",
      title: "",
      description: "", // Initialize with empty string since it's required
      videoSection: `Untitled Section ${courseContentData.length + 1}`,
      videoLength: "",
      links: [{ title: "", url: "" }],
      suggestion: "",
    };
    setCourseContentData([...courseContentData, newContent]);
  };

  const handleRemoveContent = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData.splice(index, 1);
    setCourseContentData(updatedData);
  };

  const handleContentChange = (
    index: number,
    field: keyof CourseContentItem,
    value: string
  ) => {
    const updatedData = [...courseContentData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
    };
    setCourseContentData(updatedData);
  };

  const handleAddLink = (contentIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[contentIndex].links = [
      ...updatedData[contentIndex].links,
      { title: "", url: "" },
    ];
    setCourseContentData(updatedData);
  };

  const handleLinkChange = (
    contentIndex: number,
    linkIndex: number,
    field: keyof Link,
    value: string
  ) => {
    const updatedData = [...courseContentData];
    updatedData[contentIndex].links[linkIndex] = {
      ...updatedData[contentIndex].links[linkIndex],
      [field]: value,
    };
    setCourseContentData(updatedData);
  };

  const handleRemoveLink = (contentIndex: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[contentIndex].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleFileUpload = async (files: FileList, index: number) => {
    const updatedData = [...courseContentData];

    if (!updatedData[index].documents) {
      updatedData[index].documents = [];
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64String = await fileToBase64(file); // Convert file to base64
      updatedData[index].documents!.push({
        name: file.name,
        type: file.type,
        size: file.size,
        file: base64String, // Send base64 string instead of File object
      });
    }

    setCourseContentData(updatedData);
    toast.success("Documents added successfully!");
  };

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveDocument = (contentIndex: number, docIndex: number) => {
    const updatedData = [...courseContentData];
    if (updatedData[contentIndex].documents) {
      updatedData[contentIndex].documents!.splice(docIndex, 1);
      setCourseContentData(updatedData);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const toggleCollapse = (index: number) => {
    const newCollapsedState = [...isCollapsed];
    newCollapsedState[index] = !newCollapsedState[index];
    setIsCollapsed(newCollapsedState);
    setActiveSection(index);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      courseContentData[courseContentData.length - 1].title === "" ||
      courseContentData[courseContentData.length - 1].videoUrl === ""
    ) {
      toast.error("Please fill all the fields for the last section");
    } else {
      setActive(active + 1);
      handleSubmit();
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className="text-[25px] font-Poppins font-[600] dark:text-white">
          Course Content
        </h1>
        <button
          className="p-2 px-6 bg-blue-600 text-white rounded-md"
          onClick={handleAddNewContent}
        >
          Add New Section
        </button>
      </div>

      {courseContentData.map((item, index) => (
        <div
          key={index}
          className={`w-full bg-white dark:bg-slate-800 p-4 rounded-lg mb-4 ${
            activeSection === index
              ? "border-2 border-blue-500"
              : "border border-gray-300 dark:border-gray-700"
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeSection === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                } mr-2`}
              >
                {index + 1}
              </div>
              <h1 className="text-[20px] font-Poppins font-[600] dark:text-white">
                {item.videoSection}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                className="mr-2 text-blue-600 dark:text-blue-400"
                onClick={() => toggleCollapse(index)}
              >
                {isCollapsed[index] ? "Edit" : "Collapse"}
              </button>
              {courseContentData.length > 1 && (
                <button
                  className="text-red-600 dark:text-red-400"
                  onClick={() => handleRemoveContent(index)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {!isCollapsed[index] && (
            <div className="mt-4">
              <div className="mb-4">
                <label className={`${styles.label} dark:text-white`}>
                  Section Title
                </label>
                <input
                  type="text"
                  placeholder="Section Title"
                  className={`${styles.input} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                  value={item.videoSection}
                  onChange={(e) =>
                    handleContentChange(index, "videoSection", e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className={`${styles.label} dark:text-white`}>
                  Video Title
                </label>
                <input
                  type="text"
                  placeholder="Video Title"
                  className={`${styles.input} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                  value={item.title}
                  onChange={(e) =>
                    handleContentChange(index, "title", e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className={`${styles.label} dark:text-white`}>
                  Video URL
                </label>
                <input
                  type="text"
                  placeholder="Video URL"
                  className={`${styles.input} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                  value={item.videoUrl}
                  onChange={(e) =>
                    handleContentChange(index, "videoUrl", e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className={`${styles.label} dark:text-white`}>
                  Video Length (in minutes)
                </label>
                <input
                  type="text"
                  placeholder="Video Length"
                  className={`${styles.input} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                  value={item.videoLength || ""}
                  onChange={(e) =>
                    handleContentChange(index, "videoLength", e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className={`${styles.label} dark:text-white`}>
                  Video Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Video Description"
                  className={`${styles.input} dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[100px]`}
                  value={item.description || ""}
                  onChange={(e) =>
                    handleContentChange(index, "description", e.target.value)
                  }
                />
              </div>

              {/* Links Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={`${styles.label} dark:text-white`}>
                    Links & Resources
                  </label>
                  <button
                    className="text-blue-600 dark:text-blue-400 flex items-center text-sm"
                    onClick={() => handleAddLink(index)}
                  >
                    <BsLink45Deg className="mr-1" /> Add Link
                  </button>
                </div>

                {item.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Link Title"
                      className={`${styles.input} dark:bg-gray-700 dark:text-white dark:border-gray-600 flex-1`}
                      value={link.title}
                      onChange={(e) =>
                        handleLinkChange(
                          index,
                          linkIndex,
                          "title",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Link URL"
                      className={`${styles.input} dark:bg-gray-700 dark:text-white dark:border-gray-600 flex-1`}
                      value={link.url}
                      onChange={(e) =>
                        handleLinkChange(
                          index,
                          linkIndex,
                          "url",
                          e.target.value
                        )
                      }
                    />
                    <button
                      className="p-2 bg-red-500 text-white rounded-md"
                      onClick={() => handleRemoveLink(index, linkIndex)}
                      title="Remove Link"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                ))}
              </div>

              {/* Document Upload Section */}
              <div className="mb-4">
                <div className="flex w-full items-center justify-between mb-2">
                  <label className={`${styles.label} dark:text-white`}>
                    Resource Documents
                  </label>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-all ${
                    item.dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    const updatedData = [...courseContentData];
                    updatedData[index].dragActive = true;
                    setCourseContentData(updatedData);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    const updatedData = [...courseContentData];
                    updatedData[index].dragActive = false;
                    setCourseContentData(updatedData);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const updatedData = [...courseContentData];
                    updatedData[index].dragActive = false;

                    const files = e.dataTransfer.files;
                    if (files.length) {
                      handleFileUpload(files, index);
                    }
                    setCourseContentData(updatedData);
                  }}
                >
                  <div className="text-center">
                    <input
                      type="file"
                      id={`document-upload-${index}`}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      multiple
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          handleFileUpload(e.target.files, index);
                        }
                      }}
                    />
                    <label
                      htmlFor={`document-upload-${index}`}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center py-4">
                        <AiOutlinePlusCircle className="text-3xl mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Drag & drop or click to upload documents
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Supported formats: PDF, Word, PowerPoint, Text
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Display uploaded documents */}
                  {item.documents && item.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Uploaded Documents:
                      </div>
                      {item.documents.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
                        >
                          <div className="flex items-center">
                            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-md mr-2">
                              {doc.type.includes("pdf")
                                ? "📄"
                                : doc.type.includes("doc")
                                ? "📝"
                                : doc.type.includes("ppt")
                                ? "📊"
                                : "📃"}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(doc.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                            onClick={() =>
                              handleRemoveDocument(index, docIndex)
                            }
                            title="Remove Document"
                          >
                            <AiOutlineDelete className="text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

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

export default CourseContent;
