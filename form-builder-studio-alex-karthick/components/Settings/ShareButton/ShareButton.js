import { Dialog } from "primereact/dialog"
import { InputText } from 'primereact/inputtext'
import { Button } from "primereact/button"
import { useState } from "react"

export default function ShareDialog({ formDefinition }) {
    const [domain] = window.location.host.split('/')
    const http = domain == 'localhost:3000' ? 'http' : 'https'
    const currentURL = `${http}://${domain}/form-builder-studio/view/${formDefinition.id}`

    const handleLinkCopy = async() => {
        try {
            await navigator.clipboard.writeText(currentURL)
            alert('Link copied to clipboard successfully')
        } catch (err) {
            console.error('Failed to copy link', err)
        }
    }

    const handleNewTab = () => {
        window.open(currentURL, '_blank')
    }

    return (
        <>
            <div className='flex align-items-center'>
                <Button icon="pi pi-clone" onClick={handleLinkCopy} style={{marginRight: '0.25rem', backgroundColor: '#003459', border: '0'}} />
                <Button icon="pi pi-external-link" onClick={handleNewTab} style={{marginRight: '0.25rem', backgroundColor: '#003459', border: '0'}} />
                <InputText value={currentURL} disabled style={{width: '100%'}} />
            </div>
            </>
    )
}