import Flex from '../../Layout/Flex'
import Header from '../../Header/Header'
import { Button } from 'primereact/button'
import { useEffect, useState, useRef } from 'react'
import { axiosGet } from '../../../helpers/Axios'
import Modal from '../../Modal/Modal'
import ApprovalForm from '../Form/ApprovalForm'
import { Toast } from 'primereact/toast'
import Datagrid from '../Datagrid/Datagrid'
import { dateFormat } from '../../../utillites/dateFormat'
import { Accordion, AccordionTab } from 'primereact/accordion'

export const ApproverStatus = ({ formId, metaDataId, children }) => {

    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [type, setType] = useState('APPROVING')
    const toast = useRef(null)
    const [formStatus, setFormStatus] = useState({})
    const [events, setEvents] = useState([])

    const showSuccess = () => {
        toast.current.show({ severity: `${type === 'APPROVING' ? 'success' : 'warn'}`, summary: `${type === 'APPROVING' ? 'Approved' : 'Rejected'}`, life: 3000 })
    }

    const onHide = () => {
        setIsVisible(prev => !prev)
    }

    useEffect(() => {
        axiosGet(`Form/Transaction/${metaDataId}`)
            .then(res => {
                setFormStatus(res.data)
                console.log('Transaction', res.data)
                console.log('event', getEvent(res.data.formTransactions, res.data.status))
                setEvents(getEvent(res.data.formTransactions, res.data.status))
            })
            .catch(err => console.log('err from api', err))
            .finally(() => setLoading(false))
    }, [metaDataId])


    const getEvent = (transactionsData, currentStatus) => {
        const sortedArray = transactionsData.sort(function (a, b) {
            return new Date(a.dateUpdated) - new Date(b.dateUpdated);
        })
        return sortedArray.map(
            data => {
                const currentData = {
                    name: data.authorLegalName,
                    status: data.statusText,
                    date: data.formSubmissionDataId,
                    icon: 'pi pi-user',
                    active: data.status === currentStatus,
                    date: data.lastUpdatedOn
                }
                return currentData
            }
        )
    }


    const ApproverTimeLine = ({ events }) => {

        const ApproverTimeLineItems = ({ active, index, approverName, approverStatus, lastUpdate }) => {
            return (
                <>
                    <Flex direction={'column'} className={'w-2 gap-1 mt-3'} tooltip={lastUpdate} >
                        <small className='px-2 border-round w-max align-self-center font-semibold' style={{ backgroundColor: '#eaf0f5' }} >{approverName}</small>
                        <div className={`${index === 0 ? 'border-round-left' : index === events.length - 1 ? 'border-round-right' : ''}`} style={{ backgroundColor: '#dce4ea' }}  >
                            <div className={`${active ? 'bg-primary' : ''} p-2 border-round text-center font-bold`} >{approverStatus}</div>
                        </div>
                    </Flex>
                </>
            )
        }

        return (
            <>
                <Flex className={'w-10'} >
                    {
                        events && events.length > 0
                            ? events.map((event, index) => (
                                <ApproverTimeLineItems index={index} active={event.active} approverName={event.name} approverStatus={event.status} lastUpdate={event.date} />))
                            :
                            <Flex className={'w-full justify-content-center'}>
                                <div className="div">
                                    <Header size={3} >Data not found</Header>
                                </div>
                            </Flex>
                    }
                </Flex >
            </>
        )
    }



    const columns = [
        { field: 'approver', header: 'Approver Name', sortable: true },
        { field: 'statusText', header: 'Status', sortable: true },
        { field: 'stageComments', header: 'Comments', sortable: true },
        {
            body: (data) => (dateFormat(data.dateUpdated)), header: 'Last Update', sortable: true
        },
    ]

    return (
        <>
            {
                loading ?
                    <p>loading...</p>
                    :
                    <>
                        <ApproverTimeLine events={events} />
                        <Flex className={'gap-1 justify-content-start align-items-center p-1 mt-3'} >
                            <Flex className={'gap-5'} >
                                <Header size={4} className={'m-0 p-0'} >
                                    Form ID:
                                </Header>
                                <span>{formStatus?.formId}</span>
                                <Header size={4} className={'m-0 p-0'} >
                                    Form Type:
                                </Header>
                                <span>Doc</span>
                                <Header size={4} className={'m-0 p-0'} >
                                    Form Title:
                                </Header>
                                <span>{formStatus.formDefinition?.name}</span>
                                <Header size={4} className={'m-0 p-0'} >
                                    Current Status:
                                </Header>
                                <span>{formStatus?.statusName}</span>
                                {/* <Badge value={`${formStatus?.statusName} ${formStatus?.currentApprover !== '' ? `${'[' + formStatus?.currentApprover + ']'}` : ''}`} severity="success"></Badge> */}
                            </Flex>
                        </Flex>
                        {/* <Flex direction={'column'} className={'bg-white border-round p-3 mt-3'} >
                            <Header size={3}>Your Information</Header>
                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for={"firstname"} className='mr-5' >Firstname</label>
                                    <InputText id={'firstName'} value={formStatus?.userFullLegalName?.split(' ')[0]} disabled />
                                </div>
                                <div class="field col">
                                    <label for="lastname" className='mr-5'>Lastname</label>
                                    <InputText id={'lastname'} value={formStatus?.userFullLegalName?.split(' ')[1]} disabled />
                                </div>
                            </div>
                            <div class="formgrid grid">
                                <div class="field col">
                                    <label for="email" className='mr-5'>email</label>
                                    <InputText id={'email'} value={formStatus?.userEmail} disabled />
                                </div>
                                <div class="field col">
                                    <label for="studentID" className='mr-5'>Student ID</label>
                                    <InputText id={'studentID'} value='' disabled />
                                </div>
                            </div>
                        </Flex> */}
                        <Flex direction={'column'} className={'bg-white border-round p-3 mt-3'} >
                            <Header size={3}>Letter Request Information</Header>
                            {children}
                            <Flex className={'justify-content-start my-5'} >
                                {
                                    formStatus?.statusName === 'InReview' || formStatus?.statusName === 'Pending' ?
                                        <Flex className={'gap-3'}>
                                            <Button severity={'danger'} label={'Reject'} rounded onClick={() => {
                                                setType('REJECTING')
                                                onHide()
                                            }} />
                                            <Button severity={'success'} label={'Approve'} rounded onClick={() => {
                                                setType('APPROVING')
                                                onHide()
                                            }} />
                                        </Flex>
                                        :
                                        null
                                }
                            </Flex>
                        </Flex>
                        <Flex direction={'column'} className={'bg-white border-round p-3 mt-3'} >
                            <Accordion activeIndex={0} className='mb-5'>
                                <AccordionTab header="Audit History">
                                    <Datagrid loading={loading} data={formStatus?.formTransactions} columns={columns} />
                                </AccordionTab>
                            </Accordion>
                        </Flex>
                        <Modal header={'Approver'} visible={isVisible} onHide={onHide} style={{ width: '50wv' }}  >
                            <ApprovalForm type={type} formId={formStatus?.formDefinitionId} metaDataId={metaDataId} onHide={onHide} showSuccess={showSuccess} />
                        </Modal>
                        <Toast ref={toast} />
                    </>
            }
        </>
    )
}