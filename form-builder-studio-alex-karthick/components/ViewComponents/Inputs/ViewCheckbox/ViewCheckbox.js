import { Checkbox } from 'primereact/checkbox'
import { useState } from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

export default function ViewCheckbox({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, validations, defaultValue } = metadata 
    const defaultValueIds = metadata?.options
        .map((option, index) => {
            if (option.value === defaultValue?.[index]) {
                return index
            }
        })
        .filter(id => id !== undefined)
    const [checkedValues, setCheckedValues] = useState(value?.checkbox || [])
    const [checkedIds, setCheckedIds] = useState(defaultValue ? defaultValueIds : value?.ids || [])
    const onCheckboxChange = (e) => {
        const { checked, value, target: { id } } = e
        let selectedCheckbox = [...checkedValues]
        let selectedIds = [...checkedIds]

        if (checked) {
            selectedCheckbox.push(value)
            selectedIds.push({$numberInt: id})
        }
        else {
            selectedCheckbox = selectedCheckbox.filter((checkboxValue) => checkboxValue !== value)
            selectedIds = selectedIds.filter((checkboxId) => checkboxId.$numberInt != id)
        }

        setCheckedValues(selectedCheckbox)
        setCheckedIds(selectedIds)

        return { target: { name, value: { checkbox: selectedCheckbox, ids: selectedIds } } }
    }

    return (
        <ComponenentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                {metadata.options.length > 0 &&
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
                                        checked={checkedIds.some(id => id.$numberInt == index)} 
                                        disabled={disabled}
                                    />
                                    <label>{checkboxes.value}</label>
                                </div>
                            )
                        })}
                    </>
                }
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}