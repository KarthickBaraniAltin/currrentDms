import { Checkbox } from 'primereact/checkbox'
import { useEffect, useState } from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'

export default function CreateCheckbox({ metadata, onChange, openDialog, errors, setMetadata }) {
    const { name, label, subtitle, validations, defaultValue } = metadata 
    const defaultValueIds = metadata?.options
        .map((option, index) => {
            if (option.value === defaultValue?.[index]) {
                return index
            }
        })
        .filter(id => id !== undefined)
    const [checkedValues, setCheckedValues] = useState(metadata?.options)
    const [checkedIds, setCheckedIds] = useState([])
    const [eventObject, setEventObject] = useState({ target: { name: name, value: [] } })

    useEffect(() => {
        setCheckedIds(defaultValueIds)
    }, [defaultValue])

    const onCheckboxChange = (e) => {
        let selectedCheckbox = [...checkedValues]
        let selectedId = [...checkedIds]

        if (e.checked) {
            selectedCheckbox.push(e.value)
            selectedId.push(e.target.id)
        }
        else {
            selectedCheckbox.splice(selectedCheckbox.indexOf(e.value), 1)
            selectedId.splice(selectedId.indexOf(e.target.id), 1)
        }

        setCheckedValues(selectedCheckbox)
        setCheckedIds(selectedId)

        setEventObject(prevState => {
            let tempState = JSON.parse(JSON.stringify(prevState))
            tempState.target.value = selectedCheckbox
            return tempState
        })

        return { ...eventObject, target: { ...eventObject.target, value: selectedCheckbox } }
    }

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                {metadata.options.length > 0 ?
                    <>
                        {metadata.options.map((checkboxes, index) => {
                            return (
                                <div className='mb-1' key={index}>
                                    <Checkbox
                                        className='mr-1'
                                        key={index}
                                        id={index}
                                        value={checkboxes.value}
                                        onChange={(e) => onChange(onCheckboxChange(e))}
                                        checked={checkedIds.some(id => id === index)}
                                    />
                                    <label>{checkboxes.value}</label>
                                </div>
                            )
                        })}
                    </>
                    : <p>{'Click dialog to add checkboxes'}</p>
                }
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer >
    )
}