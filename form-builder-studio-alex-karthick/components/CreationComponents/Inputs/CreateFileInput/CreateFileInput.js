import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/File/File.module.css'

export default function CreateFileInput({ metadata, openDialog, onChange, errors, setMetadata }) {
    const { name, label, multiple, subtitle, validations, guid, id, page } = metadata

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
            <LabelContainer className={sharedStyles.labelContainer}>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <input
                    name={name}
                    type='file'
                    className={clsx('col-12', sharedStyles.file, errors?.length > 0 && 'p-invalid')}
                    disabled
                    multiple={multiple}
                    onChange={onChange}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}
