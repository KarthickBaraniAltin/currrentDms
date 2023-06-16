import SideNavbar from "../components/SideNavbar/SideNavbar"
import Flex from "../components/Layout/Flex"

export default function Layouts({ children, router }) {
    return (
        <Flex className={'gap-2 bgPrimaryLight'} style={{ width: '100%', height: !router.pathname.includes("/update/") ? '90dvh' : '100dvh' }}  >
            {!router.pathname.includes("/update/") && <SideNavbar />}
            <div className='h-full w-full overflow-y-scroll' > {/* overflow-y-scroll' */}
                {children}
            </div>
        </Flex >
    )
}