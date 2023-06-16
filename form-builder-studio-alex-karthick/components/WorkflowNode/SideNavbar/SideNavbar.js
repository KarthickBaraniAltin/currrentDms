import { Button } from "primereact/button"
import Image from 'next/image'
import { memo, useState } from "react";
import approverIcon from '../../../svg/approver.svg'
import endIcon from '../../../svg/End.svg'
import backArrowIcon from '../../../svg/Back_arrow.svg'
import Col from '../../Layout/Col';
import Header from '../../Header/Header';
import Flex from '../../Layout/Flex'

function SideNavbar() {

    const [sideNavOpen, setSideNavOpen] = useState(false)

    const Icon = ({ icon }) => {
        return (
            <Image
                priority
                src={icon}
                alt="Follow us on Twitter"
            />
        )
    }


    const fields = [
        {
            nodeId: 1,
            nodeName: 'Approver',
            nodeType: 'approver',
        },
        {
            nodeId: 2,
            nodeName: 'End',
            nodeType: 'end',
        }
    ]

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    const Field = ({ nodeName, nodeType }) => {
        return (
            <div className="shadow-1  border-round w-100 my-3 p-2" style={{
                backgroundColor: '#f7f9fc',
                color: '#004990'
            }} draggable={true} onDragStart={e => onDragStart(e, nodeType)} >
                <Flex className={`gap-2 justify-content-${sideNavOpen ? 'start' : 'center'}`} >
                    <div>
                        <Icon icon={nodeType === 'end' ? endIcon : approverIcon} />
                    </div>
                    <div>
                        {sideNavOpen ? nodeName : null}
                    </div>
                </Flex>
            </div>
        )
    }

    console.log('sideRerender')

    return (
        <Col className={` transition-all transition-duration-500 ${sideNavOpen ? 'col-2' : 'col-1'} h-full`} >
            <aside className="p-3 bg-white border-round shadow-3 h-full" >
                <Flex direction={'column'} >
                    <Flex className={'justify-content-end'} >
                        <Button className="w-100 bg-white border-none outline-none" onClick={() => setSideNavOpen(prev => !prev)} >
                            {
                                <div className={`transition-all transition-duration-500 ${sideNavOpen ? '' : '-rotate-180'}`} >
                                    <Image src={backArrowIcon} alt={'BackIcon'} />
                                </div>
                            }
                        </Button>
                    </Flex>
                    <div>
                        <Header size={4} style={{ color: '#004990' }} className='font-semi' >{sideNavOpen ? 'Custom Node' : 'C'}</Header>
                    </div>
                    <div >
                        {
                            fields.map(field => (<Field key={field.nodeId} nodeName={field.nodeName} nodeType={field.nodeType} />))
                        }
                    </div>
                </Flex>
            </aside>
        </Col>
    )
}

export default memo(SideNavbar)