import LexicalEditor from '../LexicalEditor/LexicalEditor'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputMask } from 'primereact/inputmask'
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import calendarStyle from  '../SharedComponents/Calendar/Calendar.module.css'
import numberStyle from '../SharedComponents/Number/Number.module.css'
import textStyle from '../SharedComponents/Text/Text.module.css'
import textAreaStyle from '../SharedComponents/Textarea/Textarea.module.css'
import dropdownStyle from '../SharedComponents/Dropdown/Dropdown.module.css'
import maskStyle from '../SharedComponents/Mask/Mask.module.css'

export const ConditionText = ({name, value, onChange}) => {
    return (
        <InputText 
            className={`col-12 mt-2 ${textStyle.inputText}`} 
            name={name} 
            value={value} 
            autoComplete='off'
            onChange={(e) => onChange(e.target.value)}
        />
    )
}

export const ConditionCalendar = ({name, value, onChange}) => {
    return (
        <Calendar 
            className={`col-12 mt-2 ${calendarStyle.calendar}`}
            name={name}
            value={value} 
            onChange={(e) => onChange(e.value)} 
        />
    )
}

export const ConditionTime = ({name, value, onChange}) => {
    return (
        <Calendar
            name={name}
            className={`col-12 mt-2 ${calendarStyle.calendar}`}
            timeOnly 
            showTime 
            hourFormat='12' 
            value={value}
            onChange={(e) => onChange(e.value)}
        />
    )
}

export const ConditionNumber = ({name, value, onChange}) => {
    return (
        <InputNumber
            name={name}
            className={`col-12 mt-2 ${numberStyle.number}`}
            value={value}
            onChange={(e) => onChange(e.value)}
            useGrouping={false}
        />
    )
}

export const ConditionTextArea = ({name, value, onChange}) => {
    return (
        <InputTextarea
            className={`col-12 mt-2 ${textAreaStyle.textareaInput}`} 
            name={name} 
            value={value} 
            autoResize 
            onChange={(e) => onChange(e.target.value)} 
        />
    )
}

export const ConditionMask = ({name, metadata, value, onChange}) => {
    const { mask } = metadata

    return (
        <InputMask
            className={`col-12 mt-2 ${maskStyle.mask}`} 
            name={name} 
            value={value}
            onChange={(e) => onChange(e.value)}
            mask={mask} 
        />
    )
}

export const ConditionDropDown = ({name, metadata, value, onChange}) => {
    const { options } = metadata
    
    return (
        <Dropdown 
            name={name} 
            className={`col-12 mt-2 ${dropdownStyle.dropdown}`} 
            value={value} 
            onChange={(e) => onChange(e.value)}
            options={options} 
        />
    )
}

export const ConditionMultiSelect = ({name, metadata, value, onChange}) => {
    const { options} = metadata

    return (
        <MultiSelect 
            className={`col-12 mt-2 ${dropdownStyle.dropdown}`} 
            name={name} 
            value={value} 
            onChange={onChange}
            options={options} 
            display='chip' 
        />
    )
}

export const ConditionRichText = ({name, value, assignValuesNested}) => {
    return (
        <LexicalEditor 
            className='mt-2'
            name={name} 
            value={value} 
            onChange={assignValuesNested} 
        /> 
    )
}

export const ConditionRadioButton = ({}) => {
    return (
        <></>
    )
}

export const ConditionCheckbox = ({}) => {
    return (
        <></>
    )
}