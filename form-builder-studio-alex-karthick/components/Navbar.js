import React, { useState } from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react"
import { Button } from 'primereact/button'
import Image from 'next/image'
import Feed from '../images/component_images/Feed.png'
import { Menubar } from 'primereact/menubar'
import Avatar from "../images/avatar.webp"
import LeftDownArrow from "../images/component_images/LeftDownArrow.png"

export default function Navbar({ router }) {
  const { instance, accounts } = useMsal()
  const [signout, setSignout] = useState(false)

  const { name } = accounts.length > 0 ? accounts[0] : {}

  // For Navbar documentation please go: https://www.primefaces.org/primereact/menubar/
  const authenticatedItems = [
    {
      label: 'Logout',
      command: () => instance.logoutPopup()
    }
  ]

  const unauthenticatedItems = [
    {
      label: 'Login',
      command: () => instance.loginPopup()
    }
  ]

  const logoutButton = <Button label='logout' className='btn btn-primary mr-3' onClick={() => instance.logoutPopup()} />
  const loginButton = <Button label='Sign In' className='btn btn-primary mr-3' onClick={() => instance.loginPopup()} />
  const logoContainerStyle = { color: 'white', display: 'flex' }

  const logoContainer = (
    <div style={logoContainerStyle}>
      <div style={{ padding: '1.5rem', color: '#003549', fontSize: '32px' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '20px' }}>
          <Image src={Feed} width={35} height={35} style={{ alignSelf: 'center' }} />
          AcadDocs
          {router.pathname.includes("/view/") && <Image src={LeftDownArrow} width={35} height={35} style={{ cursor: 'pointer', marginTop: '0.2rem' }} onClick={() => router.back()} />}
        </div>
      </div>
    </div>
  )

  const profile = (
    <>
      <div style={{
        margin: '3px',
        padding: '5px',
        // backgroundColor: '#E0E0E0',
        borderRadius: '5px',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{name}</div>
            <small>Power Admin</small>
          </div>
          <Image src={Avatar} width={40} height={40} alt={'Avatar'} style={{ cursor: 'pointer' }} onClick={() => setSignout(prev => !prev)} />
        </div>
        {signout &&
          <div style={{ position: 'absolute', right: '0', backgroundColor: 'lightgrey', width: '200px', padding: '2rem 0 0.5rem 3.5rem', height: '100px' }}>
            <Button label='Log Out' style={{ backgroundColor: '#003459', color: '#F7F9FA', border: '0' }} onClick={() => instance.logoutPopup()} />
          </div>
        }
      </div>
    </>
  )


  return (
    <>
      <AuthenticatedTemplate>
        {!router.pathname.includes("/update/") &&
          <Menubar style={{ padding: '0', width: '100%' }} start={logoContainer} end={profile} />
        }
      </AuthenticatedTemplate>
      {/* <UnauthenticatedTemplate>
        <Button label='Sign In' className='btn btn-primary mr-3' onClick={() => instance.loginPopup()} />
      </UnauthenticatedTemplate> */}
    </>
  )

}