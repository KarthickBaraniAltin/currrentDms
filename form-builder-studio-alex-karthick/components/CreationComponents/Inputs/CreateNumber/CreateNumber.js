import clsx from 'clsx'
import { InputNumber } from 'primereact/inputnumber'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

import sharedStyles from '../../../SharedComponents/Number/Number.module.css'

export default function CreateNumber({ metadata, value, onChange, openDialog, errors, setMetadata }) {
    const { name, validations, label, subtitle, defaultValue, guid, id, page } = metadata

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputNumber
                    name={name}
                    className={clsx('col-12', sharedStyles.number, errors?.length > 0 && 'p-invalid')}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    useGrouping={false}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}
