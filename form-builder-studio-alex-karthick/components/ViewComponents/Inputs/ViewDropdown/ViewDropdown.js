import { Dropdown } from 'primereact/dropdown'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/Dropdown/Dropdown.module.css'

export default function ViewDropdown({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, options, validations, defaultValue } = metadata

    return (
        <ComponenentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <Dropdown
                    name={name}
                    className={clsx('col-12', sharedStyles.dropdown, errors?.length > 0 && 'p-invalid')}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    options={options} 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}