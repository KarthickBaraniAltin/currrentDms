import { InputMask } from 'primereact/inputmask'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/Mask/Mask.module.css'

export default function ViewMask({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, defaultValue, disabled, mask, validations } = metadata

    return (
        <ComponenentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputMask
                    className={clsx('col-12', sharedStyles.mask, errors?.length > 0 && 'p-invalid')}
                    name={name}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    mask={mask} 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}