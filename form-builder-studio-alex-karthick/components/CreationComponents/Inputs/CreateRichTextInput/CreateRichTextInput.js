import LexicalEditor from '../../../LexicalEditor/LexicalEditor'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import SettingsButton from '../../SettingsButton/SettingsButton'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'

import styles from '../CreateRichTextInput/CreateRichTextInput.module.css'

export default function CreateRichTextInput({ metadata, openDialog, value, onChange, errors, setMetadata }) {
    const { name, label, subtitle, guid, id, page } = metadata

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
            <LabelContainer className={`${styles.labelContainer} mr-2`}>
                <Label label={label} />
            </LabelContainer>
            <InputsContainer className={styles.inputsContainer}>
                <LexicalEditor name={name} value={value} onChange={onChange} />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponenentContainer>
    )
}
