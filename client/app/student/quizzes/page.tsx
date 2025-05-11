"use client"
import UserQuizList from "@/app/components/student/UserQuizList";
import dynamic from "next/dynamic";
import { useState } from "react";

const Header = dynamic(() => import("../../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../../components/Footer"), { ssr: false });

export default function QuizPage() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  return (
    <>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <UserQuizList />
      <Footer />
    </>
  );
}