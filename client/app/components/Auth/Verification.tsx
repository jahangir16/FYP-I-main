import { styles } from "@/app/styles/style";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import React, { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      } else {
        console.log("An error occurred:", error);
      }
    }
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    if (/^\d?$/.test(value)) {
      const newVerifyNumber = { ...verifyNumber, [index]: value };
      setVerifyNumber(newVerifyNumber);

      if (value === "" && index > 0) {
        inputRefs[index - 1].current?.focus();
      } else if (value.length === 1 && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className={`${styles.title} text-center`}>Verify Your Account</h1>
      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
          <VscWorkspaceTrusted size={40} className="text-white" />
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="text"
            key={key}
            ref={inputRefs[index]}
            className={`w-16 h-16 text-lg text-center font-semibold rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              invalidError ? "border-red-500" : "border-gray-300"
            }`}
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      {invalidError && (
        <p className="text-red-500 text-center mt-2 text-sm">
          Invalid code. Please try again.
        </p>
      )}
      <div className="w-full flex justify-center mt-6">
        <button
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
          onClick={verificationHandler}
        >
          Verify OTP
        </button>
      </div>
      <p className="text-center text-gray-700 dark:text-gray-300 mt-4 text-sm">
        Go back to sign in?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => setRoute("Login")}
        >
          Sign in
        </span>
      </p>
    </div>
  );
};

export default Verification;
