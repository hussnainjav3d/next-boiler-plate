import Image from "next/future/image";
import sideScreen from "../public/sidescreen.jpg";
import { LoginForm } from "./LoginForm";
import axios from "axios";

import { useEffect, useState } from "react";
export const Landing = () => {
  const [loadImage, setLoadImage] = useState(``);

  useEffect(() => {
    axios
      .get(
        `https://api.unsplash.com/photos/random?query=city&client_id=Yaro82o4LJPFxBR30A1vwvZ0kWJKh2eMxVGAzR2yMCk`
      )
      .then((res) => {
        return res;
      })
      .then((res) => res?.data)
      .then((res) => setLoadImage(res.urls.regular))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-wrap w-full h-full">
      <div className="flex flex-col w-full md:w-1/2 sm-2:w-1/2">
        <div className="flex flex-col justify-center w-full px-16 pt-44 my-auto md:justify-start md:pt-0 md:px-24 lg:px-52">
          <LoginForm />
        </div>
      </div>
      <div className="w-1/2 shadow-2xl md:w-1/2 sm-2:w-1/2">
        <Image className="object-cover w-full h-screen" src={sideScreen} />
      </div>
    </div>
  );
};
