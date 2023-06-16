import { Dialog } from "primereact/dialog"
import { InputText } from 'primereact/inputtext'
import { Button } from "primereact/button"
import { useState } from "react"
import { useMsalAuthentication } from "@azure/msal-react"
import { InteractionType } from "@azure/msal-browser"
import { formBuilderApiRequest } from "../../../src/msalConfig"
import { useApi } from "../../../hooks/useApi"
import { InputSwitch } from "primereact/inputswitch"

export default function StatusButton({ api, formDefinition, setFormDefinition }) {
    const { loading, callApiFetch } = useApi()
    const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)

    const handleClick = async () => {
        const accessToken = await acquireToken()

        const response = await callApiFetch(`${api}/FormDefinition/${formDefinition.id}/Status/${formDefinition.status == 0 ? 1 : 0}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })

        setFormDefinition((prev) => ({...prev, status: response.status}))
    }

    return (
        <div style={{display: 'flex', gap: '0.5rem'}}>
            <label>Published</label>
            <InputSwitch checked={formDefinition.status === 0 ? true : false} onChange={handleClick} />
        </div>
    )
}