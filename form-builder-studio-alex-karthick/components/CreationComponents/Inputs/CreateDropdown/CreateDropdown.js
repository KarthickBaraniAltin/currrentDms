import { Dropdown } from 'primereact/dropdown'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import clsx from 'clsx'
import sharedStyles from '../../../SharedComponents/Dropdown/Dropdown.module.css'

export default function CreateDropdown({ metadata, openDialog, value, onChange, errors, setMetadata }) {
    const { name, className, validations, label, subtitle, options, defaultValue } = metadata

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
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
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}
