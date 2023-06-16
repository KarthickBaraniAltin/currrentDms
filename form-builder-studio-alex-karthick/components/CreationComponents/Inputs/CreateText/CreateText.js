import { InputText } from 'primereact/inputtext'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'

import styles from '../../../../styles/Inputs/Inputs.module.css'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import clsx from 'clsx'

export default function CreateText({ metadata, value, onChange, openDialog, errors, setMetadata }) {
  const { name, className, label, subtitle, defaultValue, validations, guid, id, page } = metadata
  return (
    <ComponenentContainer>
      <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
      <LabelContainer>
        <Label label={label} validations={validations} />
      </LabelContainer>
      <InputsContainer>
        <InputText
          name={name}
          className={clsx('col-12', styles.input, errors?.length > 0 && 'p-invalid')}
          autoComplete='off'
          value={value ?? defaultValue}
          onChange={onChange}
        />
        <Subtitle subtitle={subtitle} />
        <Errors errors={errors} />
      </InputsContainer>
    </ComponenentContainer>
  )
}
