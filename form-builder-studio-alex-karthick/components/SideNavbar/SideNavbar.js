import Flex from "../Layout/Flex"
import { useRouter } from "next/router"
import { useMsal } from "@azure/msal-react"
import { useState } from "react"
import sideNavbarStyles from "./SideNavbar.module.css"
import clsx from "clsx"
import Image from "next/image"
import DownArrow from "../../images/down-filled-triangular-arrow.png"
import Gear from "../../images/gear.png"
import Clipboard from "../../images/notepad.png"
import Doc from "../../images/google-docs.png"
import Upload from "../../images/upload.png"
import Folder from "../../images/folder.png"
import { Tree } from 'primereact/tree'

/* 
*********************************************************************************************************************
=====================================================================================================================
    - It would be preferable if the sideNavbar is not made collapsible for now.
    - Before making use of any additional libraries, it would be appreciated if you could consult with the U.S. team.
    - Please do not change appSidebarMenu for now. I know it's a mess, it will be refactored.
=====================================================================================================================
*********************************************************************************************************************
*/
import useRoles from "../../hooks/useRoles"

export default function SideNavbar() {

    const router = useRouter()
    const [toggleSideNav, setToggleSideNav] = useState(false)
    const { accounts } = useMsal()
    const account = accounts.length > 0 ? accounts[0] : null

    // Variables to manipulate app sidebar menu
    const roles = useRoles()
    const [topMenu, setTopMenu] = useState(true)
    const [settingsTabs, setSettingsTabs] = useState([])
    const [endUserTabs, setEndUserTabs] = useState([])
    const startDashboard = roles && roles[0] === "Admin" ? "My Forms" : ''
    const [selectedDashboard, setSelectedDashboard] = useState(startDashboard)

    const powerUserItems = [
        {
            label: "Settings",
            icon: Gear,
            items: [
                {
                    label: "Documents",
                    items: [
                        {
                            label: "Folder Structure"
                        },
                        {
                            label: "Advanced Search"
                        }
                    ]
                },
                // {
                //     label: "Flows",
                //     items: [
                //         {
                //             label: "My Flows"
                //         }
                //     ]
                // },
                {
                    label: 'Forms',
                    items: [
                        {
                            label: 'Form Submissions',
                            onClick: () => {
                                router.push('/form-submissions-dashboard')
                            }
                        },
                        {
                            label: 'My Forms',
                            onClick: () => {
                                router.push('/')
                            }
                        }
                    ]
                }
            ]
        }
    ]

    const endUserItems = [
        {
            label: "Forms",
            icon: Clipboard,
            items: [
                {
                    label: "My Submissions",
                    items: [
                        {
                            label: "In Progress"
                        },
                        {
                            label: "Completed"
                        }
                    ]
                },
                {
                    label: "My Assignments",
                    items: [
                        {
                            label: "Awaiting For Me",
                        },
                        {
                            label: "Approved"
                        },
                        {
                            label: "Rejected"
                        }
                    ]
                }
            ]
        },
        {
            label: "Documents",
            icon: Doc,
            items: [
                {
                    label: "Awaiting For Me"
                },
                {
                    label: "Approved"
                },
                {
                    label: "Rejected"
                }
            ]
        },
        {
            label: "My Upload",
            icon: Upload,
        },
        {
            label: "Doc Repository",
            icon: Folder
        }
    ]

    const handleClick = (label, index, menuType) => {
        const labelIndex = label + index

        if (menuType === "settings") {
            setSettingsTabs(prev => {
                let tempState = JSON.parse(JSON.stringify(prev))

                if (tempState.includes(labelIndex)) {
                    const index = tempState.indexOf(labelIndex)
                    tempState.splice(index, 1)
                } else {
                    tempState.push(labelIndex)
                }

                return [
                    ...tempState
                ]
            })
        }

        if (menuType === "endUser") {
            setEndUserTabs(prev => {
                let tempState = JSON.parse(JSON.stringify(prev))

                if (tempState.includes(labelIndex)) {
                    const index = tempState.indexOf(labelIndex)
                    tempState.splice(index, 1)
                } else {
                    tempState.push(labelIndex)
                }

                return [
                    ...tempState
                ]
            })
        }
    }

    const handleRoute = (label) => {
        switch (label) {
            case "Folder Structure":
            case "Advanced Search":
                setSelectedDashboard(label)
                router.push("/dashboard");
                break;
            case "My Forms":
                setSelectedDashboard(label)
                router.push("/");
                break;
            case "In Progress":
                setSelectedDashboard(label)
                router.push("/MySubmissions/Submitted");
                break;
            case "Completed":
                setSelectedDashboard(label)
                router.push("/MySubmissions/Completed");
                break;
            case "Awaiting For Me":
            case "Awaiting For Me0":
                setSelectedDashboard(label)
                router.push("/MySubmissions/Pending");
                break;
            case "Approved":
            case "Approved1":
                setSelectedDashboard(label)
                router.push("/MySubmissions/Approved");
                break;
            case "Rejected":
            case "Rejected2":
                setSelectedDashboard(label)
                router.push("/MySubmissions/Rejected");
                break;
            case "Form Submissions":
                setSelectedDashboard(label)
                router.push("/form-submissions-dashboard");
                break
            case "My Upload":
                router.push("/document/upload");
                break;
        }
    }


    const node = [
        {
            key: "0",
            label: "Nevada University",
            data: "Events Folder",
            icon: "pi pi-fw pi-home",
            children: [
                {
                    key: "1",
                    label: "Academic affairs",
                    data: "Events Folder",
                    icon: "pi pi-fw pi-sitemap",
                    children: [
                        {
                            key: "0-0",
                            label: "ID",
                            data: "Work Folder",
                            icon: "pi pi-fw pi-inbox",
                            command: () => {
                                router.push({
                                    pathname: '/document/search',
                                    query: { data: '5628c245-8622-4842-9785-347c3bcd81ff' }
                                    // '/document/search'
                                });
                            },
                            children: [
                                {
                                    key: "0-0-0",
                                    label: "Driving License",
                                    icon: "pi pi-fw pi-file",
                                    data: "Expenses Document",
                                    command: () => {
                                        router.push({
                                            pathname: '/document/search',
                                            query: { data: '68769c9e-c9df-4a47-a0b7-606ce9ce8445' }
                                            // '/document/search'
                                        });
                                    }
                                },
                                {
                                    key: "0-0-1",
                                    label: "Passport",
                                    icon: "pi pi-fw pi-file",
                                    data: "Resume Document",
                                    command: () => {
                                        router.push({
                                            pathname: '/document/search',
                                            query: { data: 'd7044ae4-5cf4-43fc-8699-2bdd31f2de0c' }
                                            // '/document/search'
                                        });
                                    }
                                }
                            ]
                        },
                    ]
                },
            ]
        }
    ];


    let selectedKey = {};
    let setSelectedKey;

    [selectedKey, setSelectedKey] = useState({});

    const [nodes, setNodes] = useState([]);

    const documentMenuClick = (e) => {
        console.log('Event : ' + e.value);

        let data = "";
        if (e.value == "0") {
            data = "5628c245-8622-4842-9785-347c3bcd81ff-0";
        } else if (e.value == "1") {
            data = "5628c245-8622-4842-9785-347c3bcd81ff-1";
        } else if (e.value == "0-0") {
            data = "5628c245-8622-4842-9785-347c3bcd81ff";
        } else if (e.value == "0-0-0") {
            data = "68769c9e-c9df-4a47-a0b7-606ce9ce8445";
        } else if (e.value == "0-0-1") {
            data = "d7044ae4-5cf4-43fc-8699-2bdd31f2de0c";
        } else if (e.value == "0-0-2") {
            data = "4504d06b-2358-41cf-a642-9a1928f1497b";
        }

        router.push({
            pathname: '/document/search/' + data,
            // query: { data: data }
            // '/document/search'
        });
    }

    // appSidebarMenu will be refactored in the future to improve readability. Please do not touch.
    const appSidebarMenu = (
        <>
            {roles && roles.includes('Admin') &&
                <div>
                    {powerUserItems.map((item, index) => {
                        return (
                            <div key={index} >
                                <div className={sideNavbarStyles.alignImages}>
                                    {item.hasOwnProperty("icon") && <Image src={item.icon} width={16} height={16} />}
                                    <div className={clsx("mx-2", sideNavbarStyles.parentLabel)} onClick={() => { setTopMenu(true), handleClick(item.label, index, "settings") }}>{item.label}</div> {/* Settings */}
                                    {<Image src={DownArrow} style={{ transform: settingsTabs.includes(item.label + index) && topMenu ? "rotate(180deg)" : '' }} width={16} height={16} />}
                                </div>
                                {topMenu && settingsTabs.includes(item.label + index) &&
                                    item.items.map((item, index) => {
                                        return (
                                            <>
                                                <div className={sideNavbarStyles.alignImages}>
                                                    <div className={clsx("mx-3", sideNavbarStyles.parentLabel)} onClick={() => handleClick(item.label, index, "settings")}>{item.label}</div>
                                                    {<Image src={DownArrow} style={{ transform: settingsTabs.includes(item.label + index) ? "rotate(180deg)" : '' }} width={16} height={16} />}
                                                </div>
                                                {settingsTabs.includes(item.label + index) &&
                                                    item.items.map((subItem, index) => {
                                                        console.log("subItem.label:", subItem.label)
                                                        return (
                                                            <div key={index}>
                                                                <div className={clsx("mx-4", sideNavbarStyles.pointer, sideNavbarStyles.childLabel, selectedDashboard === subItem.label ? sideNavbarStyles.activeChildLabel : '')} onClick={() => handleRoute(subItem.label)}>{subItem.label}</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </>
                                        )
                                    })
                                }
                            </div>
                        )
                    })}
                </div>
            }
            <div className={sideNavbarStyles.dividingLine}></div>
            {
                <div onClick={() => setTopMenu(false)}>
                    {endUserItems.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className={sideNavbarStyles.alignImages} onClick={() => { handleClick(item.label, index, "endUser"); handleRoute(item.label) }}>
                                    {item.hasOwnProperty("icon") && <Image src={item.icon} width={16} height={16} />}
                                    <div className={clsx("mx-2", sideNavbarStyles.parentLabel)}>{item.label}</div>
                                    {item.hasOwnProperty('items') && <Image src={DownArrow} style={{ transform: endUserTabs.includes(item.label + index) ? "rotate(180deg)" : '' }} width={16} height={16} />}
                                </div>
                                {
                                    item.hasOwnProperty('items') && endUserTabs.includes(item.label + index) &&
                                    item.items.map((subItem, subIndex) => {
                                        return (
                                            <>
                                                <div className={sideNavbarStyles.alignImages} onClick={() => handleClick(item.label, subIndex + 4, "endUser")}>
                                                    {subItem.label === "Awaiting For Me" || subItem.label === "Approved" || subItem.label === "Rejected" ?
                                                        <div className={clsx("mx-3", selectedDashboard === subItem.label + subIndex ? sideNavbarStyles.activeChildLabel : '')} onClick={() => handleRoute(subItem.label + subIndex)}>{subItem.label}</div>
                                                        :
                                                        <>
                                                            <div className={clsx("mx-3", sideNavbarStyles.parentLabel)}>{subItem.label}</div>
                                                            {subItem.hasOwnProperty('items') && <Image src={DownArrow} style={{ transform: endUserTabs.includes(item.label + (subIndex + 4)) ? "rotate(180deg)" : '' }} width={16} height={16} />}
                                                        </>
                                                    }
                                                </div>
                                                {subItem.hasOwnProperty('items') && endUserTabs.includes(item.label + (subIndex + 4)) &&
                                                    subItem.items.map((lastItem, index) => {
                                                        return (
                                                            <div key={index} className={clsx("mx-4", sideNavbarStyles.childLabel, selectedDashboard === lastItem.label ? sideNavbarStyles.activeChildLabel : '')} onClick={() => handleRoute(lastItem.label)}>{lastItem.label}</div>
                                                        )
                                                    })
                                                }
                                            </>
                                        )
                                    })
                                }
                            </div>
                        )
                    })}
                </div>

            }
            <Tree value={node} selectionMode="single" selectionKeys={selectedKey}
                onSelectionChange={(e) => { documentMenuClick(e); }}
                className="w-full md:w-15rem" style={{ backgroundColor: '#024f7c', paddingRight: '0', paddingLeft: '0', border: 'none', paddingTop: '0' }} />
        </>
    )

    return (
        <aside className={sideNavbarStyles.sideNavbarColors} style={{ width: '250px' }}>
            <Flex direction="column" className={"h-full"} >
                <div className="h-full" style={{ padding: "0.5rem" }}>
                    {appSidebarMenu}
                </div>
            </Flex>
        </aside>
    )
}