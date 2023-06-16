
import { Button } from 'primereact/button'
import { Handle, Position } from "reactflow"
import Modal from '../../../Modal/Modal'
import { useState } from 'react'
import ApproverForm from './ApproverForm'


export function ApproverNode(node) {



    // const approvers = [
    //     { id: 1, name: 'Guna Rajendran' },
    //     { id: 2, name: 'Sharbil Andrews' },
    //     { id: 3, name: 'Peter Grino' },
    //     { id: 4, name: 'Vijaya lakshimi' },
    // ]

    const [isVisible, setIsVisible] = useState(false)
    const onHide = () => {
        setIsVisible(prev => !prev)
    }



    const NodeHeader = (node) => {

        return (
            <>
                <div className='flex w-14rem justify-content-between h-full' >
                    <div>
                        <h3 className='font-bold text-700' >Approver</h3>
                    </div>

                    {/* <SpeedDial model={items} direction="up" transitionDelay={80} className='p-button-icon p-0 m-0' rounded text size='small' showIcon="pi pi-bars" hideIcon="pi pi-times" /> */}
                    <div className='flex align-items-center gap-1' >
                        <Button icon="pi pi-pencil" className='p-button-icon' rounded text severity="secondary" size='small' onClick={() => {
                            console.log(node.node.id)
                            node.node.data.setCurrentNodeId(node.node.id)
                            onHide()
                        }} />
                        <Button icon="pi pi-times" className='p-button-icon' rounded text severity="secondary" size='small' onClick={() => node.node.data.onRemoveNode(node.node.id)} />
                    </div>
                </div>
                {
                    node.node.data.approverData && node.node.data.approverData.approverName !== ''
                        ?
                        <div className='flex justify-content-center' >
                            <strong className='font-bold text-600 p-1' >{node.node.data.approverData.approverName}</strong>
                        </div>
                        :
                        null
                }
            </>
        )
    }


    return (
        <>
            <div>
                <Handle type={'target'} id={'t-1'} position="top" />
                <div className="border-round bg-white shadow-2 w-full h-full px-4 p-2">
                    <NodeHeader node={node} />
                    {/* <div className='flex flex-column gap-2'>
                        <h1 className='font-bold' >Approver</h1>
                        <span className="p-float-label">
                            <Dropdown id='approvalName' className='w-14rem p-inputtext-sm' value={selectValue} onChange={(e) => setSelectValue(e.value)} options={approvers} optionLabel='name' optionValue='id' />
                            <label htmlFor='approvalName' >Approver Name</label>
                        </span>
                    </div> */}
                </div>
                <Handle type="source" position={Position.Bottom} id={'s-1'} className=' bg-green-500 p-1 mr-4 ' />
                <Handle type="source" position={Position.Bottom} id={'s-2'} className=' bg-red-500 p-1 ml-4' />
            </div>
            <Modal header={'Approver'} visible={isVisible} onHide={onHide}  >
                <ApproverForm node={node} setIsVisible={setIsVisible} setApproverData={node.data.setApproverData} />
            </Modal>
        </>
    )
}

export default ApproverNode