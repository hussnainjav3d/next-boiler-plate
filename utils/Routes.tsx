import Router from 'next/router'
import { useState } from 'react'

export const Routes = (props:any) => {
  const { Component, pageProps } = props

  const [loggedIn] = useState(false)

  // if (typeof window !== `undefined`) {
  //   if (!loggedIn) {
  //     Router.push(`/login`)
  //   } else {
  //     Router.push(`/`)
  //   }
  // }

  return <Component {...pageProps} />
  
}

