import { Calendar } from 'primereact/calendar'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import Label from '../../../SharedComponents/Label/Label'

import sharedStyles from '../../../SharedComponents/Calendar/Calendar.module.css'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import clsx from 'clsx'

export default function CreateCalendar({metadata, value, onChange, openDialog, errors, setMetadata}) {
  const { name, label, subtitle, defaultValue, validations } = metadata
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
          value={value ?? convertDataFormat}
          onChange={onChange}
        />
        <Subtitle subtitle={subtitle} />
        <Errors errors={errors} />
      </InputsContainer>
    </ComponenentContainer>
  )
}
