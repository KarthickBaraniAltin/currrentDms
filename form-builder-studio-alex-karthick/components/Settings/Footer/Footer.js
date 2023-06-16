import { Button } from 'primereact/button'
import React from 'react'

export default function Footer({handleUpdate, options, setInvalidOptions}) {
  return (
    <div>
        <Button label='Delete' icon='pi pi-times' className='p-button-danger' onClick={() => handleUpdate(true)} />
        <Button label='Update' icon='pi pi-check' onClick={() => handleUpdate(false, options, setInvalidOptions)} autoFocus />
    </div>
  )
}
