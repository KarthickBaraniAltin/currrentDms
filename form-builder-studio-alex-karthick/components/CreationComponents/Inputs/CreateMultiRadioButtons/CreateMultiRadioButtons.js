import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import { useState } from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

export default function CreateMultiRadioButtons({ metadata, openDialog, value, onChange, errors, setMetadata }) {
    const { name, label, subtitle, options, otherOptions, validations, defaultValue } = metadata

    const [checkedValue, setCheckedValue] = useState()
    const [otherChecked, setOtherChecked] = useState()
    const [otherOptionInputValue, setOtherOptionInputValue] = useState('')

    const handleOtherOption = () => {
        setCheckedValue('PlACEHOLDER')
        setOtherChecked(true)
        setOtherOptionInputValue('')
    }

    const handleOtherOptionInputValueChange = (value) => {
        setOtherOptionInputValue(value)

        const eventObject = {
            target: {
                name: name,
                value: {
                    savedInput: value,
                    isOther: true
                }
            }
        }

        onChange(eventObject)
    }

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                {options.length > 0 || otherOptions.length > 0 ?
                    <>
                        {options.map((radioButton, index) => {
                            return (
                                <div className='mt-1' key={index}>
                                    <RadioButton
                                        value={radioButton.value}
                                        name={name}
                                        onChange={(e) => {
                                            setCheckedValue(radioButton.value)
                                            setOtherChecked(null)
                                            onChange(e)
                                        }}
                                        checked={checkedValue ? checkedValue === radioButton.value : defaultValue === radioButton.value}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    <label>{radioButton.value}</label>
                                </div>
                            )
                        })}
                        {otherOptions &&
                            <div className='mt-1' key={options.length + 1}>
                                <RadioButton
                                    value={otherOptionInputValue}
                                    name={name}
                                    onChange={() => handleOtherOption()}
                                    checked={otherChecked}
                                />
                                <label> Other:</label>
                                {otherChecked &&
                                    <InputText className='col-12 mt-2' value={otherOptionInputValue} onChange={(e) => handleOtherOptionInputValueChange(e.target.value)} />
                                }
                            </div>
                        }
                    </>
                    : <p>{'Click dialog to add radiobuttons'}</p>
                }
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}