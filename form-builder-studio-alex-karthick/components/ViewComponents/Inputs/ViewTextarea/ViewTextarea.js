import { InputTextarea } from 'primereact/inputtextarea'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import clsx from 'clsx'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

import sharedStyles from '../../../SharedComponents/Textarea/Textarea.module.css'
import styles from '../ViewTextarea/ViewTextarea.module.css'


export default function ViewTextarea({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, defaultValue, validations } = metadata

    return (
        <ComponenentContainer>
            <LabelContainer className={`${sharedStyles.textareaLabel} ${styles.labelWidthContainer}`}>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer className={styles.inputsContainer}>
                <InputTextarea 
                    className={clsx('col-12', sharedStyles.textareaInput, errors?.length > 0 && 'p-invalid')} 
                    name={name} 
                    value={value ?? defaultValue} 
                    autoResize 
                    onChange={onChange} 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}