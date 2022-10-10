import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { json } from "stream/consumers";
import { BACK_END_API } from "../config";
import { setAuthCode } from "../store/slices/user";
import { useDispatch } from "../store/store";
import styles from "../styles/Home.module.css";
import axios from "axios";
interface Session {
  sessionExpiry: Date;
  sessionKey: string;
}
const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // console.log(`router`, router);
  const effectRan = useRef(false);
  useEffect(() => {
    const cookies = document.cookie.split(`;`);
    const currentTime: Date = new Date();
    const refinedCookies: Session = {
      sessionExpiry: new Date(),
      sessionKey: ``,
    };
    cookies.forEach((cookie) => {
      refinedCookies[cookie.split(`=`)[0].trim()] = cookie.split(`=`)[1];
    });

    console.log(`refinedCookies.sessionExpire`, refinedCookies.sessionExpiry);
    console.log(currentTime < new Date(refinedCookies.sessionExpiry));

    if (effectRan.current === true) {
      const url = window.location.search;

      const urlParams = new URLSearchParams(url);
      const serviceId: string = urlParams.get(`serviceId`) as string;
      const redirectUri: string = urlParams.get(`redirectUri`) as string;
      const nonce: string = urlParams.get(`nonce`) as string;

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
              console.log(`err`, err);
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
    }
    return () => {
      effectRan.current = true;
    };
  }, []);
  return <div className="text-center text-2xl"> </div>;
};

export default Home;
