import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BACK_END_API } from "../config";
import { setAuthCode } from "../store/slices/user";
import { useDispatch } from "../store/store";
import axios from "axios";
import Lottie from "lottie-react";
import Mylogo from "../public/loader.json";
interface Session {
  sessionExpiry: Date;
  sessionKey: string;
  [key: string]: any;
}
const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const effectRan = useRef(false);
  const [isLogout, setIsLogout] = useState(``);
  useEffect(() => {
    const cookies = document.cookie.split(`;`);
    const currentTime: Date = new Date();

    const refinedCookies: Session = {
      sessionExpiry: new Date(),
      sessionKey: ``,
    };
    cookies.forEach((cookie) => {
      const item: string = cookie.split(`=`)[0].trim();
      refinedCookies[item] = cookie.split(`=`)[1];
    });

    if (effectRan.current === true) {
      const url = window.location.search;

      const urlParams = new URLSearchParams(url);
      const serviceId: string = urlParams.get(`serviceId`) as string;
      const redirectUri: string = urlParams.get(`redirectUri`) as string;
      const nonce: string = urlParams.get(`nonce`) as string;
      const logout: string = urlParams.get(`logout`) as string;
      setIsLogout(logout);
      if (!logout) {
        if (currentTime < new Date(refinedCookies.sessionExpiry)) {
          try {
            axios
              .post(`${BACK_END_API}/api/services/validate-service`, {
                serviceId,
                redirectUri,
                nonce,
                sessionKey: refinedCookies.sessionKey,
              })
              .then((res) => res?.data)
              .then((res) => {
                console.log(`res`, res);
                localStorage.setItem(
                  "redirectUri",
                  urlParams.get(`redirectUri`) as string
                );
                dispatch(setAuthCode(res?.data?.nonceId));
                res?.data?.authCode &&
                  window.location.assign(
                    `${
                      redirectUri?.split(`auth`)[0]
                    }auth/oidc-redirect?authCode=${
                      res?.data?.authCode
                    }&nonceId=${nonce}`
                  );
              })
              .catch((err) => {
                Router.push(`/login`);
              });
          } catch {
            console.log(`something went wrong`);
          }
        } else {
          try {
            axios
              .post(`${BACK_END_API}/api/services/validate-service`, {
                serviceId: urlParams.get(`serviceId`),
                redirectUri: urlParams.get(`redirectUri`),
                nonce: urlParams.get(`nonce`),
              })
              .then((res) => res?.data)
              .then((res) => {
                console.log(`res`, res);
                localStorage.setItem(
                  "redirectUri",
                  urlParams.get(`redirectUri`) as string
                );
                dispatch(setAuthCode(res?.data?.nonceId));
                Router.push("/login");
              })
              .catch(
                (err) =>
                  err?.message &&
                  window.location.assign(
                    `${
                      urlParams.get(`redirectUri`)?.split(`auth`)[0]
                    }?error="Redirect uri not found"`
                  )
              );
          } catch {
            console.log(`something went wrong`);
          }
        }
      } else {
        console.log(`logout`);

        try {
          axios
            .post(`${BACK_END_API}/api/user/log-out`, {
              sessionKey: refinedCookies.sessionKey,
            })
            .then((res) => res?.data)
            .then((res) => {
              console.log(`res`, localStorage.getItem("redirectUri"));
              document.cookie = `sessionExpiry=""`;
              document.cookie = `sessionKey=""`;
              window.location.assign(
                `${localStorage.getItem("redirectUri")?.split(`auth`)[0]}`
              );
            })
            .catch((err) => {
              window.location.assign(
                `${
                  localStorage.getItem("redirectUri")?.split(`auth`)[0]
                }dashboard`
              );
            });
        } catch {
          console.log(`something went wrong`);
        }
      }
    }
    return () => {
      effectRan.current = true;
    };
  }, []);
  return (
    <div className="text-center text-2xl">
      <div className="h-screen w-full grid place-content-center">
        <Lottie
          animationData={Mylogo}
          loop={true}
          autoplay={true}
          className="h-40"
        />
        <p className="-bottom-44 text-xl font-bold capitalize">
          {isLogout ? `Logging Out, See You Soon` : `Signing in, please wait`}
        </p>
      </div>
    </div>
  );
};

export default Home;
