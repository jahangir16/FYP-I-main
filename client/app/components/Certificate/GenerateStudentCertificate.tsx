import React, { useState } from "react";
import { useGenerateCertificateMutation } from "@/redux/features/certificate/certificateApi";
import { FaDownload, FaTimes } from "react-icons/fa";

interface GenerateStudentCertificateProps {
  userName: string;
  courseName: string;
  date: string;
  userId: string;
  courseLevel: string;
  onClose: () => void;
}

const GenerateStudentCertificate: React.FC<GenerateStudentCertificateProps> = ({
  userName,
  courseName,
  date,
  courseLevel,
  userId,
  onClose,
}) => {
  const data = {
    userName: userName,
    courseName: courseName,
    issueDate: date,
    courseLevel: courseLevel,
    userId: userId,
  };
  const [generateCertificate, { isLoading, error }] =
    useGenerateCertificateMutation();
  const [success, setSuccess] = useState(false);
  const handleDownload = async () => {
    try {
      const response = await generateCertificate({ data }).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificate.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess(true);
    } catch (error) {
      setSuccess(true);
      console.error("Error downloading certificate:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6 z-50">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-4xl border-4 border-gray-300 text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          title="Close"
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        {/* Certificate Header */}
        <h1 className="text-2xl font-bold text-gray-700 uppercase border-b-2 pb-2">
          Certificate of Completion
        </h1>

        {/* Certificate Content */}
        <div className="mt-6">
          <h2 className="text-4xl font-extrabold text-gray-900">
            {courseName}
          </h2>
          <p className="text-lg text-gray-500 italic">Learn {courseName}</p>
        </div>

        <p className="text-lg text-gray-600 mt-6">Presented to</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-2">{userName}</h3>

        <p className="text-gray-600 mt-2">
          <strong>Course Level:</strong> {courseLevel}
        </p>
        <p className="text-gray-600">
          <strong>Date:</strong> {date}
        </p>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mt-6">
            Certificate downloaded successfully!
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300 transition-all"
          >
            <FaDownload />{" "}
            {isLoading ? "Downloading..." : "Download Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateStudentCertificate;
