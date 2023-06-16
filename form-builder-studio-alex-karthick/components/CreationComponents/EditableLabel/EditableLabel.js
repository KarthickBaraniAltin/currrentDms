import { InputText } from 'primereact/inputtext'
import React from 'react'

export default function EditableLabel({label, metadata, setMetadata}) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex justify-content-between mr-1">
        {/* {isEditing && 
          <InputText 
            name={}
            value={}
          />  
        } */}
        {!isEditing && 
          <label className='block' style={{fontWeight: '700', fontSize: '11pt',color: '#000000'}} onDoubleClick={handleDoubleClick}>
              {label}
          </label>
        }
    </div>
  )
}