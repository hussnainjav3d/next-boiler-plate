import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Routes } from '../Utils/Routes'

function MyApp({ Component, pageProps }: AppProps) {
  return  <Routes Component={Component} pageProps={{ ...pageProps }} />
}

export default MyApp
