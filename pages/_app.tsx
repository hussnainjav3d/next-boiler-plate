import { Routes } from '../utils/Routes'
import { Provider } from 'react-redux'
import { store } from '../store/store';
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {

  return  (
    <Provider store={store}>
      <Routes Component={Component} pageProps={{ ...pageProps }} />
    </Provider>
  )
}

export default MyApp
