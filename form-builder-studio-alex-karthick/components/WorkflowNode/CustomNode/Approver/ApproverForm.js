import { InputText } from "primereact/inputtext"
import { InputNumber } from "primereact/inputnumber"
import { Dropdown } from "primereact/dropdown"
import { Checkbox } from "primereact/checkbox"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import SelectInput from "../../../Input/SelectInput"

function ApproverForm({ node, setIsVisible, setApproverData }) {

    console.log(node)
    const currentData = node.data.approverData

    const [approverName, setApproverName] = useState('')
    const [requiredComments, setRequireComments] = useState(false)
    const [reminder, setReminder] = useState(false)
    const [reminderInterval, setReminderInterval] = useState('Hours')
    const intervals = ['Hours', 'Days', 'Weeks']
    const [reminderTimes, setReminderTimes] = useState(0)

    useEffect(() => {
        if (currentData) {
            setApproverName(currentData.approverName)
            setRequireComments(currentData.requiredComments)
            setReminder(currentData.reminderOption.reminder)
            setReminderInterval(currentData.reminderOption.reminderInterval)
            setReminderTimes(currentData.reminderOption.reminderTimes)
        }
    }, [currentData])


    const ReminderOption = () => {
        return (
            <div className="flex flex-column gap-2">
                <label htmlFor="times" className="font-bold block mb-2">Send After</label>
                <div className={'flex gap-2'}>
                    <InputNumber inputId="times" value={reminderTimes} onValueChange={e => setReminderTimes(e.value)} min={0} max={10} />
                    <Dropdown value={reminderInterval} onChange={(e) => setReminderInterval(e.value)} options={intervals} className="w-full md:w-14rem flex-grow-1" />
                </div>
            </div>
        )
    }

    const approvers = [
        { name: 'Karthick', email: 'barani@altinlab.com' },
        { name: 'Guna', email: 'guna@altinlab.com' },
        { name: 'Peter', email: 'peter@altinlab.com' },
        { name: 'Sharbil', email: 'sharbil@altinlab.com' },
        { name: 'Chandra', email: 'chandra@altinlab.com' },
        { name: 'Vijaylakshmi', email: 'Vij@altinlab.com' }
    ];

    return (
        <div className='flex flex-column gap-3 m-2 p-3'>
            <div className="w-full" >
                <SelectInput label={'Approver Name'} value={approverName} onChange={(e) => setApproverName(e.value)} options={approvers} optionLabel="name" optionValue="email" />
            </div>
            {/* <span className="p-float-label">
                <InputText className='w-full' id="Approver Email" type={'email'} value={approverName} onChange={(e) => {
                    setApproverName(e.target.value)
                }} />
                <label htmlFor="Approver Email">Approver Email</label>
            </span> */}
            <div className="flex align-items-center">
                <Checkbox inputId="requiredComments" checked={requiredComments} onChange={e => setRequireComments(e.target.checked)} />
                <label htmlFor="requiredComments" className="ml-2">Require Comments</label>
            </div>
            <div className="flex align-items-center">
                <Checkbox inputId="reminder" checked={reminder} onChange={e => setReminder(e.target.checked)} />
                <label htmlFor="reminder" className="ml-2">Reminders Emails</label>
            </div>
            {
                reminder ? <ReminderOption /> : null
            }

            <div className="flex justify-content-end gap-2">
                <Button label='Return' severity={'danger'} rounded onClick={() => setIsVisible(prev => !prev)} />
                <Button style={{ backgroundColor: '#004990', borderStyle: 'none' }} label='Save' className="text-white" rounded onClick={() => {
                    setApproverData((prev) => ({ ...prev, approverName, requiredComments, reminderOption: { ...prev.reminderOption, reminder, reminderTimes, reminderInterval } }))
                    setIsVisible(prev => !prev)
                }} />
            </div>
        </div>
    )
}

export default ApproverForm