"use client";

import UserQuizList from "@/app/components/student/UserQuizList";
import StudentProtected from "@/app/hooks/onlyUserProtected";


const StudentQuizPage = () => {
  return (
    <StudentProtected>
      <UserQuizList />
    </StudentProtected>
  );
};

export default StudentQuizPage;