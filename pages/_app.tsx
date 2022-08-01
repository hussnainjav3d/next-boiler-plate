import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Routes } from '../Utils/Routes'
import { Provider } from 'react-redux'
import { store } from '../store/store';

function MyApp({ Component, pageProps }: AppProps) {

  return  (
    <Provider store={store}>
      <Routes Component={Component} pageProps={{ ...pageProps }} />
    </Provider>
  )
}

export default MyApp
