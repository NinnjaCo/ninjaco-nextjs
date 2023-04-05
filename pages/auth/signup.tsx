import Head from 'next/head'
import Menu from '@/components/menu'
import React from 'react'

const Signup = () => {
  return (
    <>
      <Head>
        <title>NinjaCo | Sign Up</title>
      </Head>
      <main>
        <Menu
          menuOption={{
            logoToUse: 'dark',
            startBackgroundDark: false,
            startTextWhite: false,
          }}
        ></Menu>
      </main>
    </>
  )
}

export default Signup
