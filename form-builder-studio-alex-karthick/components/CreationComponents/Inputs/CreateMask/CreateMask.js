import { InputMask } from 'primereact/inputmask'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/Mask/Mask.module.css'

export default function CreateMask({ metadata, value, onChange, openDialog, errors, setMetadata }) {
    const { name, label, subtitle, mask, validations, guid, id, page } = metadata

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputMask
                    name={name}
                    className={clsx('col-12', sharedStyles.mask, errors?.length > 0 && 'p-invalid')}
                    value={value}
                    onChange={onChange}
                    mask={mask}
                    autoClear={false}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}