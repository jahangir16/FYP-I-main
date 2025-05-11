"use client";
import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
// Lazy load components
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const Profile = dynamic(() => import("../components/Profile/Profile"), {
  ssr: false,
});
const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="min-h-screen">
      <Protected>
        <Heading
          title={`${user?.name} profile - EDUvibe`}
          description="EDUvibe is a platform for students to learn and get help from teachers"
          keywords="Prograaming,MERN,Redux,Machine Learning"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
        <Footer />
      </Protected>
    </div>
  );
};

export default Page;
