import React, { useState } from "react";
import Image from "next/future/image";
import brandLogo from "../public/brandLogo.svg";
import { PasswordInput } from "./Common/InputField";
import { BACK_END_API } from "../config";
import { useSelector } from "../store/store";
import Router from "next/router";

export const LoginForm = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { nonceId } = useSelector(({ user }) => user);
  const redirectUri = localStorage.getItem("redirectUri");
  const handleLogin = () => {
    fetch(`${BACK_END_API}/api/user/log-in`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        nonceId: nonceId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.hasError) {
          window.location.assign(`${redirectUri.split(`auth`)[0]}?error=""`);
        } else {
          console.log(`test535`, res);

          window.location.assign(
            `${redirectUri.split(`auth`)[0]}?authCode=${
              res.data.authCode
            }&nonceId=${nonceId}`
          );
          console.log(`redirectUri`, redirectUri.split(`auth`)[0]);
        }
      })
      .catch((err) => {
        if (err) {
          window.location.assign(`${redirectUri.split(`auth`)[0]}?error=""`);
        }
      });
    console.log({ email, password });
  };
  return (
    <div className="w-2/3 mx-auto">
      <Image
        src={brandLogo}
        alt="Logo will go here"
        className="text-left w-60 h-36"
      />
      <div className="flex flex-col gap-y-6 py-2">
        <div className="flex-1">
          <PasswordInput
            type="text"
            name="Email"
            title="Email"
            id="email"
            placeholder="Email"
            errorMessage=""
            setValue={(e: React.SyntheticEvent): void => {
              setEmail((e?.target as HTMLInputElement).value);
            }}
            tipdata="Email"
          />
        </div>
        <div className="flex-1">
          <PasswordInput
            type="password"
            name="password"
            title="Password"
            id="password"
            placeholder="password"
            setValue={(e: React.SyntheticEvent): void =>
              setPassword((e?.target as HTMLInputElement).value)
            }
            tipdata="Password"
          />
        </div>
      </div>
      <button
        onClick={() => handleLogin()}
        disabled={!email && !password}
        className="py-2 px-4 w-full flex justify-center items-center bg-red-500  hover:bg-red-700 focus:ring-red-500 
        focus:ring-offset-red-200 text-white transition 
          ease-in duration-200 text-center text-base 
          font-semibold shadow-md 
          focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      >
        Log In
      </button>
      {/* <p className="text-gray-400 text-right text-sm mt-2">
        <span
          onClick={() => console.log(`forget password`)}
          className="border-b-1 hover:border-blue-500 hover:text-blue-500 cursor-pointer"
        >
          Forgot Password
        </span>
      </p> */}
    </div>
  );
};
