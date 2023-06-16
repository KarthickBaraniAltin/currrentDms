import React from 'react'
import Head from 'next/head'
import { Card } from 'primereact/card'
import { AuthenticatedTemplate } from '@azure/msal-react'

export default function Home() {

  return (
    <>
      <Head>
          <title>Test Page</title>
          <link rel='icon' sizes='32x32' href='/logo.png' />
      </Head>
      <AuthenticatedTemplate>
        <Card className='card form-horizontal mt-5' style={{width: '80%'}} >
  
        </Card>
      </AuthenticatedTemplate>
    </>
  )
}

