"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
const Signup: FC<{ setRoute: (route: string) => void; role: string }> = ({
  setRoute,
  role,
}) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Registration successful");
      setRoute("Verification");
    }
    if (error && "data" in error) {
      toast.error((error as any).data.message);
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", role },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter your name!"),
      email: Yup.string()
        .email("Invalid email!")
        .required("Please enter your email!"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters!")
        .required("Please enter your password!"),
    }),
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
        Join EDUvibe
      </h1>
      <form onSubmit={formik.handleSubmit} className="mt-6">
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="John Doe"
          />
          {formik.errors.name && formik.touched.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="loginmail@gmail.com"
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="********"
          />
          <div
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <AiOutlineEye size={20} />
            ) : (
              <AiOutlineEyeInvisible size={20} />
            )}
          </div>
          {formik.errors.password && formik.touched.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Sign Up
        </button>
      </form>

      <div className="flex items-center justify-center my-4">
        <span className="text-gray-500 dark:text-gray-400">Or join with</span>
      </div>
      <div className="flex justify-center gap-4">
        <FcGoogle
          size={30}
          className="cursor-pointer transition-transform transform hover:scale-110 text-gray-900 dark:text-white"
          onClick={() => signIn("google")}
        />
        <AiFillGithub
          size={30}
          className="cursor-pointer transition-transform transform hover:scale-110 text-gray-900 dark:text-white"
          onClick={() => signIn("github")}
        />
      </div>

      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setRoute("Login")}
        >
          {" "}
          Sign in
        </span>
      </p>
    </div>
  );
};

export default Signup;
