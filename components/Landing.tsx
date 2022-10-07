
import Image from "next/future/image";
import sideScreen from "../public/sidescreen.jpg";
import { LoginForm } from "./LoginForm";

export const Landing = () => {
  return (
    <div className="flex flex-wrap w-full h-full">
      <div className="flex flex-col w-full md:w-1/2 sm-2:w-1/2">
        <div
          className="flex flex-col justify-center w-full px-16 pt-44 my-auto md:justify-start md:pt-0 md:px-24 lg:px-52"
        >
          <LoginForm />
        </div>
      </div>
      <div className="w-1/2 shadow-2xl md:w-1/2 sm-2:w-1/2">
        <Image
          className="object-cover w-full h-screen"
          src={sideScreen}
        />
      </div>
    </div>
  );
};
