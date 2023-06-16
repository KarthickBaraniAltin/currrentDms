import { MultiSelect } from 'primereact/multiselect'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/Dropdown/Dropdown.module.css'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

export default function ViewMultiselect({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, options, validations, defaultValue } = metadata

    return (
        <ComponenentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <MultiSelect
                    className={clsx('col-12', sharedStyles.dropdown, errors?.length > 0 && 'p-invalid')}
                    name={name}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    options={options} 
                    display='chip' 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}