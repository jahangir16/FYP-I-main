"use client";
import React, { useState } from "react";
("use client");
import dynamic from "next/dynamic";
import Heading from "../utils/Heading";

// Lazy load components
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });
const FAQ = dynamic(() => import("../components/FAQ/FAQ"), { ssr: false });

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(4);
  const [route, setRoute] = useState("Login");

  return (
    <div className="min-h-screen">
      <Heading
        title="FAQ - EDUvibe"
        description="EDUvibe is a learning management system for helping programmers."
        keywords="programming,mern"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <br />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Page;
