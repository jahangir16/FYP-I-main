import React, { useEffect, useState } from "react";
import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout?.categories || []);
    }
    if (layoutSuccess) {
      toast.success("Categories updated successfully");
      refetch();
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, layoutSuccess, error, refetch]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const newCategoriesHandler = () => {
    if (!Array.isArray(categories)) {
      setCategories([{ _id: Date.now().toString(), title: "" }]);
      return;
    }
    if (
      categories.length > 0 &&
      categories[categories.length - 1].title === ""
    ) {
      toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory: any) => [
        ...prevCategory,
        { _id: Date.now().toString(), title: "" },
      ]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((q) => q.title === "");
  };

  const editCategoriesHandler = async () => {
    if (data?.layout?.categories) {
      if (
        !areCategoriesUnchanged(data.layout.categories, categories) &&
        !isAnyCategoryTitleEmpty(categories)
      ) {
        await editLayout({
          type: "Categories",
          categories,
        });
      }
    }
  };

  // Calculate `canSave` only if `data` is defined
  const canSave =
    data?.layout?.categories &&
    !areCategoriesUnchanged(data.layout.categories, categories) &&
    !isAnyCategoryTitleEmpty(categories);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-10 mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Course Categories
            </h1>

            <div className="space-y-4">
              {categories &&
                categories.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all hover:shadow-sm"
                  >
                    <input
                      className="flex-1 px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={item.title}
                      onChange={(e) =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                      placeholder="Enter category title..."
                    />
                    <button
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      onClick={() => {
                        setCategories((prevCategory: any) =>
                          prevCategory.filter((i: any) => i._id !== item._id)
                        );
                      }}
                      aria-label="Delete category"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={newCategoriesHandler}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 z-10">
            <button
              onClick={canSave ? editCategoriesHandler : () => null}
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

export default EditCategories;
