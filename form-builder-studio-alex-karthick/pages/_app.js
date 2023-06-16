import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '../scss/customs.scss'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { msalConfig } from '../src/msalConfig'
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import Head from 'next/head'
import { BreadCrumb } from 'primereact/breadcrumb';
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import Layouts from '../Layouts/Layouts'
import LandingPageBackground from "../images/landingPageBackground.png"
import LandingPageAcadDocs from "../images/landingPageAcadDocs.png"
import Image from 'next/image'
import Link from 'next/link'

export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  } else if (event.eventType === EventType.POPUP_OPENED) {
    console.log("Popup Opened");
  } else if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
    console.log("Error while accuiring the token");
  } else if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
    console.log("Token acquire successful");
  }
})

function MyApp({ Component, pageProps, ...appProps }) {
  const { instance } = useMsal()
  const router = useRouter()

  const customLabel = (item) => {
    return (
      <Link href={item.url}>
        <span >{item.title}</span>
      </Link>
    )
  }

  function generateBreadcrumbs() {
    const asPathWithoutQuery = router.asPath.split("?")[0]
    const asPathNestedRoutes = asPathWithoutQuery.split("/")
      .filter(v => v.length > 0)
    const crumblist = asPathNestedRoutes.map((subpath, idx) => {

      const url = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      const title = subpath
      return { template: customLabel, url, title }
    })

    return [{ template: customLabel, url: '/', title: 'Home' }, ...crumblist];
  }

  const getContent = () => {

    if (appProps.router.pathname == '/blank') { // update with /blank
      return <Component {...pageProps} />
    }

    const Crumb = () => {
      return (
        <div className={'p-breadcrumb shadow-none border-none bg-none'} >
          <div className='p-menuitem' >
            <label className='p-menuitem-text' >Home</label>
            <span className='p-breadcrumb-chevron' ></span>
          </div>
          <div className='p-menuitem' >
            <label className='p-menuitem-text' >Home</label>
            <span className='p-breadcrumb-chevron' ></span>
          </div>
        </div>
      )
    }

    return (
      <>
        <Head>
          <title>Form Definition Dashboard</title>
          <link rel='icon' sizes='32x32' href='/form-builder-studio/logo.png' />
        </Head>
        <MsalProvider instance={msalInstance}>
          <main className='colorPrimary' >
            <Navbar router={router} />
            <AuthenticatedTemplate>
              <Layouts router={router}>
                {!router.pathname.includes("/update/") &&
                  <BreadCrumb className={'w-10'} model={generateBreadcrumbs()} home={{ icon: 'pi pi-home' }} />
                }
                <Component {...pageProps} />
              </Layouts>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <div className="flex justify-content-between" style={{height: "100vh"}}>
                <div className="w-full flex align-items-center justify-content-center">
                 <div className="flex flex-column">
                 <h1>Welcome</h1>
                  <Button 
                    label='Sign In'
                    style={{color: "#003459", border: '1px solid #003459', backgroundColor: 'white'}}
                    onClick={() => msalInstance.loginPopup()} 
                  />
                 </div>
                </div>
                <div className="w-full" style={{position: "relative"}}>
                  <Image 
                    src={LandingPageBackground}
                    fill="true"
                    style={{ objectFit: "cover", objectPosition: "right bottom" }}
                    alt='Landing Page Background'
                  />
                  <div style={{position: "absolute", top: '0', left: '0', width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: '1'}}></div>
                  <Image
                    style={{width: "auto", height: "300px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: '2', color: "gold"}}
                    src={LandingPageAcadDocs} 
                  />
                </div>
              </div>
            </UnauthenticatedTemplate>
          </main>
        </MsalProvider>
      </>
    )
  }

  return (getContent())
}

export default MyApp
