"use client";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux"; 

const PreviewQuiz = dynamic(() => import("../../Admin/Quiz/PreviewQuiz"), {
  ssr: false,
  loading: () => <div>Loading...</div>, // Add a loading state
});

export default function PreviewQuizPage() {
  const { user } = useSelector((state: any) => state.auth); // Get user info from Redux state
  const isAdmin = user?.role === "admin";
  const previewMode = isAdmin ? "admin" : "student";

  return (
    <>
      <PreviewQuiz previewMode={previewMode} />
    </>
  );
}