import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { useState, useEffect } from 'react'

export default function RequiredCheckbox({inputs, onChange}) {
    const [checked, setChecked] = useState(inputs?.validations?.required?.isRequired ?? false)
    const handleCheckboxChange = (e) => {
        if (inputs?.validations?.required) {
            setChecked(prevState => !prevState)
            inputs.validations.required.isRequired = !inputs.validations.required.isRequired;
            onChange({ target: { name: 'validations', value: inputs.validations } });
        } else {
        // This code is required because on the first click of the "required" checkbox, the isRequired property doesn't exist yet.
            setChecked(true)
            onChange({target: {name: e.target.name, value: e.target.checked}})
        }
    }

    return (
        <>
            <div className='mb-2'>
                <label className='mr-2' style={{color: '#003459'}}>Required</label>
                <Checkbox 
                    name='validations.required.isRequired' 
                    value={inputs?.validations?.required?.isRequired ?? false} 
                    onChange={(e) => handleCheckboxChange(e)} 
                    checked={checked}
                />
            </div>
            <label style={{color: '#003459'}}>Optional Message</label>
            <InputText name='validations.required.message' value={inputs?.validations?.required?.message ?? ''} onChange={onChange}/>
        </>

    )
}

// export default function RequiredCheckbox({inputs, onChange}) {
//     const [checkedRequired, setCheckedRequired] = useState(inputs?.validations?.required?.isRequired ?? false)

//     const handleCheckboxChange = () => {
//         setCheckedRequired(prevState => !prevState)      
//     }

//     useEffect(() => {
//         if (inputs?.validations?.required) {
//             if (checkedRequired) {
//                 inputs.validations.required.isRequired = true
//             } else {
//                 inputs.validations.required.isRequired = false
//             }
//         }
//     }, [checkedRequired])

//     return (
//         <>
//             <div className='mb-2'>
//                 <label className='mr-2'>Required</label>
//                 <Checkbox name='validations.required.isRequired' value={inputs?.validations?.required?.isRequired ?? false} onChange={(e) => {
//                         onChange(e),
//                         handleCheckboxChange()
//                     }} checked={checkedRequired}
//                 />
//             </div>
//             <label>Optional Message</label>
//             <InputText name='validations.required.message' value={inputs?.validations?.required?.message ?? ''} onChange={onChange}/>
//         </>

//     )
// }