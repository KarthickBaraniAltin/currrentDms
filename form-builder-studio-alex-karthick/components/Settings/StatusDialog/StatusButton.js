import { Dialog } from "primereact/dialog"
import { InputText } from 'primereact/inputtext'
import { Button } from "primereact/button"
import { useState } from "react"
import { useMsalAuthentication } from "@azure/msal-react"
import { InteractionType } from "@azure/msal-browser"
import { formBuilderApiRequest } from "../../../src/msalConfig"
import { useApi } from "../../../hooks/useApi"

export default function StatusButton({ api, formDefinition, setFormDefinition }) {
    const [showDialog, setShowDialog] = useState(false)
    const { loading, callApiFetch } = useApi()
    const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)

    function handleStatus() {
        setShowDialog(prevState => !prevState)
    }

    const handleClick = async () => {
        const accessToken = await acquireToken()

        const newStatus = formDefinition.status == 0 ? 1 : 0
        const response = await callApiFetch(`${api}/FormDefinition/${formDefinition.id}/Status/${newStatus}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })

        setFormDefinition((prev) => ({...prev, status: response.status}))
    }

    return (
        <>
            <Button label='Status' style={{width: '90px'}} onClick={handleStatus} />
            { showDialog && 
                <Dialog header='Status Page' visible={showDialog} onHide={() => handleStatus()} style={{width: '75vw'}}>
                    <div className='flex flex-column'>
                        <div className='mb-1'>
                            <div className='flex flex-column'>
                                <label>Current Status</label>
                                <InputText value={formDefinition.status === 0 ? 'ACTIVE' : 'DISABLED'} style={{backgroundColor: formDefinition.status === 0 ? 'green' : 'red', color: 'white', width: '7%'}} />
                            </div>
                        </div>
                        <Button label='Change' style={{width: '100px'}} loading={loading} onClick={handleClick} />
                    </div>
                </Dialog>
            }
        </>
    )
}