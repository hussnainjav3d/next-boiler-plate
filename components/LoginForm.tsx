import React, { useEffect, useState } from "react";
// import Image from "next/future/image";
import brandLogo from "../public/brandLogo.svg";
import { PasswordInput } from "./Common/InputField";
import { BACK_END_API } from "../config";
import { useSelector } from "../store/store";
import axios from "axios";
import Image from "next/image";

export const LoginForm = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [redirectUri, setRedirectUri] = useState(``);
  const { nonceId } = useSelector(({ user }) => user);

  useEffect(() => {
    setRedirectUri(localStorage.getItem("redirectUri") as string);
  }, []);

  const handleLogin = () => {
    axios
      .post(`${BACK_END_API}/api/user/log-in`, {
        email,
        password,
        nonceId: nonceId,
      })
      .then((res) => res?.data)
      .then((res) => {
        console.log(`response`, res);
        if (res?.hasError) {
          window.location.assign(
            `${redirectUri?.split(`auth`)[0]}?error="Login Failed"`
          );
        } else {
          res?.data?.authCode &&
            window.location.assign(
              `${redirectUri?.split(`auth`)[0]}auth/oidc-redirect?authCode=${
                res?.data?.authCode
              }&nonceId=${nonceId}`
            );
          document.cookie = `sessionExpiry=${res?.data?.sessionExpiry}`;
          document.cookie = `sessionKey=${res?.data?.sessionKey}`;
        }
      })
      .catch((err) => {
        console.log(`loginFail`);
        // if (err) {
        //   window.location.assign(`${redirectUri?.split(`auth`)[0]}?error=""`);
        // }
      });
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
