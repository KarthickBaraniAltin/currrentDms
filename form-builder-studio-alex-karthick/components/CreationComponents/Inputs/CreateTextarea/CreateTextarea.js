import { InputTextarea } from 'primereact/inputtextarea'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import SettingsButton from '../../SettingsButton/SettingsButton'
import clsx from 'clsx'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'

import sharedStyles from '../../../SharedComponents/Textarea/Textarea.module.css'
import styles from '../CreateTextarea/CreateTextares.module.css'

export default function CreateTextarea({ metadata, value, onChange, openDialog, errors, setMetadata }) {
  const { name, validations, label, subtitle, defaultValue, options, guid, id, page } = metadata

  return (
    <ComponenentContainer>
      <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
      <LabelContainer className={`${sharedStyles.textareaLabel} ${styles.labelWidthContainer}`}>
        <Label label={label} validations={validations} />
      </LabelContainer>
      <InputsContainer className={styles.inputsContainer}>
        <InputTextarea
          className={clsx('col-12', sharedStyles.textareaInput, errors?.length > 0 && 'p-invalid')}
          name={name}
          autoResize
          value={value ?? defaultValue}
          onChange={onChange}
        />
        <Subtitle subtitle={subtitle} />
        <Errors errors={errors} />
      </InputsContainer>
    </ComponenentContainer>
  )
}
