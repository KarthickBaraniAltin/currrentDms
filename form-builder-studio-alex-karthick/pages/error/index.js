import React from 'react'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Error</title>
        <link rel='icon' sizes='32x32' href='/active-directory/logo.png' />
      </Head>
      <div className='card form-horizontal mt-5 mb-3' style={{'width': '45rem'}}>
          <div className='card-body'>
              <h2 className='text-center text-primary card-title mb-3'>ERROR</h2>
          </div>
      </div>
    </>
  )
}
