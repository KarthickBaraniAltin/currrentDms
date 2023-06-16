import { Calendar } from 'primereact/calendar'
import React from 'react'
import SettingsButton from '../../SettingsButton/SettingsButton'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/Calendar/Calendar.module.css'

export default function CreateTime({ metadata, value, onChange, openDialog, errors, setMetadata }) {
  const { name, className, label, subtitle, defaultValue, validations, guid, id, page } = metadata
  const convertDataFormat = defaultValue ? new Date(defaultValue) : null

  return (
    <ComponenentContainer>
      <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
      <LabelContainer>
        <Label label={label} validations={validations} />
      </LabelContainer>
      <InputsContainer>
        <Calendar
          name={name}
          className={clsx('col-12', sharedStyles.calendar, errors?.length > 0 && 'p-invalid')}
          timeOnly
          showTime
          hourFormat='12'
          value={value ?? convertDataFormat}
          onChange={onChange}
        />
        <Subtitle subtitle={subtitle} />
        <Errors errors={errors} />
      </InputsContainer>
    </ComponenentContainer>
  )
}