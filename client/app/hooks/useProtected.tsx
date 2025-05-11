import { redirect } from "next/navigation";
import UserAuth from "./userAuth";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = UserAuth();
  return isAuthenticated ? children : redirect("/");
}
