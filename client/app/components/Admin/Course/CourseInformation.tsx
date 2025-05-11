"use client";

import type React from "react";
import { type FC, useEffect, useState } from "react";
import { styles } from "@/app/styles/style";
import Image from "next/image";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import toast from "react-hot-toast";

type Category = {
  _id: string;
  title: string;
};

type Props = {
  courseInfo: {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    tags: string;
    categories: string;
    level: string;
    demoUrl: string;
    thumbnail?: string;
  };
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState(false);
  const { data } = useGetHeroDataQuery("Categories", {});
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editLayout] = useEditLayoutMutation();
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActive(active + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") {
      toast.error("Category title cannot be empty");
      return;
    }

    const categoryExists = categories.some((cat) => cat.title === newCategory);
    if (categoryExists) {
      toast.error("Category already exists");
      return;
    }

    try {
      const updatedCategories = [
        ...categories,
        { _id: Date.now().toString(), title: newCategory },
      ];

      const response = await editLayout({
        type: "Categories", // Include the type field at the root level
        categories: updatedCategories,
      }).unwrap();

      console.log("Backend response:", response);

      setCategories(updatedCategories);
      setCourseInfo({ ...courseInfo, categories: newCategory });
      setNewCategory("");
      setShowAddCategoryInput(false);

      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);

      if (error && typeof error === "object" && "data" in error) {
        const errorData = error as { data?: { message?: string } };
        toast.error(errorData?.data?.message || "Failed to add category");
      } else {
        toast.error("Failed to add category");
      }
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-lg mb-4">
        <h1 className="text-[25px] font-Poppins font-[600] dark:text-white mb-6">
          Course Information
        </h1>
        <form onSubmit={handleSubmit} className={`${styles.label}`}>
          <div className="mb-4">
            <label htmlFor="name">Course Name</label>
            <input
              type="text"
              required
              value={courseInfo.name}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, name: e.target.value })
              }
              id="name"
              placeholder="MERN stack LMS platform with Next.js 13"
              className={`${styles.input}`}
            />
          </div>

          <div className="mb-4">
            <label>Course Description</label>
            <textarea
              cols={30}
              rows={8}
              placeholder="Write something amazing..."
              className={`${styles.input} !h-min !py-2`}
              value={courseInfo.description}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="w-full flex justify-between mb-4">
            <div className="w-[45%]">
              <label>Course Price</label>
              <input
                type="number"
                required
                value={courseInfo.price}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    price: Number(e.target.value),
                  })
                }
                id="price"
                placeholder="29"
                className={`${styles.input}`}
              />
            </div>
            <div className="w-[50%]">
              <label>Estimated Price (optional)</label>
              <input
                type="number"
                value={courseInfo.estimatedPrice ?? ""}
                onChange={(e) =>
                  setCourseInfo({
                    ...courseInfo,
                    estimatedPrice: Number(e.target.value),
                  })
                }
                id="estimatedPrice"
                placeholder="79"
                className={`${styles.input}`}
              />
            </div>
          </div>

          <div className="w-full flex justify-between mb-4">
            <div className="w-[45%]">
              <label>Course Tags</label>
              <input
                type="text"
                required
                value={courseInfo.tags}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, tags: e.target.value })
                }
                id="tags"
                placeholder="MERN,Next 13,Socket.io,Tailwind CSS,LMS"
                className={`${styles.input}`}
              />
            </div>
            <div className="w-full md:w-[50%] mb-4">
              <label
                htmlFor="categories"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Course Categories
              </label>
              <select
                id="categories"
                className={`
                  w-full px-4 py-2 rounded-lg border
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  border-gray-300 dark:border-gray-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors duration-200
                `}
                value={courseInfo.categories}
                onChange={(e) => {
                  if (e.target.value === "add-new") {
                    setShowAddCategoryInput(true);
                  } else {
                    setCourseInfo({
                      ...courseInfo,
                      categories: e.target.value,
                    });
                  }
                }}
              >
                <option value="">Select Category</option>
                {categories.map((item: Category) => (
                  <option value={item.title} key={item._id}>
                    {item.title}
                  </option>
                ))}
                <option value="add-new">Add New Category</option>
              </select>

              {showAddCategoryInput && (
                <div className="mt-2 flex items-center gap-2 flex-row">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className={`${styles.input} flex-1 `}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-2"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-between mb-4">
            <div className="w-full md:w-[45%] mb-4">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Course Level
              </label>
              <select
                id="level"
                className={`
      w-full px-4 py-2 rounded-lg border
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-gray-100
      border-gray-300 dark:border-gray-600
      focus:outline-none focus:ring-2 focus:ring-blue-500
      transition-colors duration-200
    `}
                value={courseInfo.level}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, level: e.target.value })
                }
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="w-[50%]">
              <label>Demo URL</label>
              <input
                type="text"
                required
                value={courseInfo.demoUrl}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
                }
                id="demoUrl"
                placeholder="eer74fd"
                className={`${styles.input}`}
              />
            </div>
          </div>

          <div className="w-full mb-4">
            <input
              type="file"
              accept="image/*"
              id="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className={`w-full min-h-[10vh] border-2 border-dashed p-3 flex items-center justify-center ${
                dragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              } rounded-md transition-all duration-300 cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {courseInfo.thumbnail ? (
                <Image
                  src={courseInfo.thumbnail || "/placeholder.svg"}
                  alt="Thumbnail"
                  width={200}
                  height={150}
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <AiOutlineCloudUpload size={30} className="mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag & drop or click to upload thumbnail
                  </p>
                </div>
              )}
            </label>
          </div>

          <div className="w-full flex items-center justify-end">
            <input
              type="submit"
              value="Next"
              className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseInformation;
