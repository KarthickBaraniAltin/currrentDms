import { Calendar } from 'primereact/calendar'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/Calendar/Calendar.module.css'

export default function ViewTime({metadata, value, onChange, errors}) {  
    const { name, disabled, label, subtitle, defaultValue, validations, guid, id, page } = metadata
    const convertDataFormat = defaultValue ? new Date(defaultValue) : null

    return (
      <ComponenentContainer> 
        <LabelContainer>
            <Label label={label} validations={validations} />
        </LabelContainer>   
        <InputsContainer>
          <Calendar 
            className={clsx('col-12', sharedStyles.calendar, errors?.length > 0 && 'p-invalid')} 
            timeOnly 
            showTime 
            hourFormat='12' 
            name={name} 
            value={value ?? convertDataFormat} 
            onChange={onChange}
            disabled={disabled}
          />
          <Subtitle subtitle={subtitle} />
          <Errors errors={errors} />
        </InputsContainer>
      </ComponenentContainer>
    )
  }