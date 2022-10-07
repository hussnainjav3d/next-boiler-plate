import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { json } from "stream/consumers";
import { BACK_END_API } from "../config";
import { setAuthCode } from "../store/slices/user";
import { useDispatch } from "../store/store";
import styles from "../styles/Home.module.css";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // console.log(`router`, router);

  useEffect(() => {
    const url = window.location.search;
    const abortController = new AbortController();
    const urlParams = new URLSearchParams(url);
    try {
      fetch(`${BACK_END_API}/api/services/validate-service`, {
        method: `POST`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: urlParams.get(`serviceId`),
          redirectUri: urlParams.get(`redirectUri`),
          nonce: urlParams.get(`nonce`),
        }),
        signal: abortController.signal,
      })
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem(
            "redirectUri",
            urlParams.get(`redirectUri`) as string
          );
          dispatch(setAuthCode(res?.data?.nonceId));
          Router.push("/login");
        });
    } catch {
      console.log(`something went wrong`);
    }
    return () => abortController.abort();
  }, []);
  return <div className="text-center text-2xl"> </div>;
};

export default Home;
