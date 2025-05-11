"use client";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Verification from "./components/Auth/Verification";
import CustomModal from "./utils/CustomModal";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(0);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        setToken(parsedAuth.token);
        setGuestMode(false);
      } else {
        setGuestMode(true);
      }
    }
  }, []);
  const shouldFetchUser = token !== null;
  const { isLoading, error } = useLoadUserQuery(undefined, {
    skip: !shouldFetchUser,
  });
  useEffect(() => {
    const handleConnection = () => {
      console.log("Socket connected");
    };

    socketId.on("connection", handleConnection);

    return () => {
      socketId.off("connection", handleConnection);
    };
  }, []);

  useEffect(() => {
    if (!token || guestMode) {
      const intervalId = setInterval(() => {
        if (!open) setOpen(true);
      }, 1000000);

      return () => clearInterval(intervalId);
    }
  }, [token, error, guestMode]);

  const getAuthComponent = () => {
    switch (route) {
      case "Login":
        return Login;
      case "Sign-Up":
        return SignUp;
      case "Verification":
        return Verification;
      default:
        return Login;
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      {children}
      <CustomModal
        open={open}
        setOpen={setOpen}
        component={getAuthComponent()}
        setRoute={setRoute}
        activeItem={activeItem}
        role="admin"
      />
    </>
  );
};
