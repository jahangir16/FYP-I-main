"use client";

import { type FC, useEffect, useState } from "react";
import {
  useGetHeroDataQuery,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { FaCamera, FaSave } from "react-icons/fa";
import Image from "next/image";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const {
    data,
    refetch,
    isLoading: dataLoading,
  } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      console.log("Data from backend:", data);

      // Set state with fallback values if data.layout.banner is missing or empty
      setTitle(data.layout?.banner?.title ?? "");
      setSubTitle(data.layout?.banner?.subTitle ?? "");
      setImage(data.layout?.banner?.image?.url ?? "");
    }

    if (isSuccess) {
      toast.success("Hero updated successfully!");
      refetch();
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, isSuccess, error, refetch]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    await editLayout({
      type: "Banner",
      image,
      title,
      subTitle,
    });
  };

  // Check if data is defined and if any field has changed
  const canSave =
    (data?.layout?.banner?.title !== title ||
      data?.layout?.banner?.subTitle !== subTitle ||
      data?.layout?.banner?.image?.url !== image) &&
    title.trim() !== "" &&
    subTitle.trim() !== "" &&
    image.trim() !== "";

  if (dataLoading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-16">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Edit Hero Banner
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {image ? (
                  <Image
                    src={image || "/placeholder.svg"}
                    alt="Banner"
                    className="w-full h-full object-contain"
                    layout="fill"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    No image selected
                  </div>
                )}
              </div>

              <label
                htmlFor="banner"
                className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition-colors"
              >
                <FaCamera className="w-5 h-5" />
              </label>

              <input
                type="file"
                id="banner"
                accept="image/*"
                onChange={handleUpdate}
                className="hidden"
                title="Upload banner image"
              />
            </div>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Recommended size: 1200 x 600 pixels
            </p>
          </div>

          {/* Text Content Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter banner title..."
                className="w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subtitle
              </label>
              <textarea
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="Enter banner subtitle..."
                className="w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-10">
        <button
          onClick={canSave ? handleEdit : () => null}
          disabled={!canSave || isLoading}
          className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all ${
            canSave && !isLoading
              ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>Processing...</>
          ) : (
            <>
              <FaSave className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditHero;
