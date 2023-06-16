import React from 'react'
import { Button } from 'primereact/button'

export default function DialogFooter({handleUpdate, name}) {
  return (
    <div>
        <Button label='Update' icon='pi pi-check' onClick={() => handleUpdate(name)} autoFocus/>
    </div>
  )
}
