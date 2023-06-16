import { InputText } from 'primereact/inputtext'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

import styles from '../../../SharedComponents/Text/Text.module.css'
import ComponenetContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import clsx from 'clsx'

export default function ViewText({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, defaultValue, validations } = metadata

    return (
        <ComponenetContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputText 
                    className={clsx('col-12', styles.inputText, errors?.length > 0 && 'p-invalid')} 
                    name={name} 
                    value={value ?? defaultValue} 
                    onChange={onChange}
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenetContainer>
    )
}
