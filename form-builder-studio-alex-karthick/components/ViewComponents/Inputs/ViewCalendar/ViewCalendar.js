import { Calendar } from 'primereact/calendar'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import clsx from 'clsx'

import sharedStyles from '../../../SharedComponents/Calendar/Calendar.module.css'

export default function ViewCalendar({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, defaultValue, validations, disabled } = metadata
    const convertDataFormat = defaultValue ? new Date(defaultValue) : null

    return (
        <ComponenentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer className={clsx('col-8')}>
                <Calendar
                    className={clsx('col-12', sharedStyles.calendar, errors?.length > 0 && 'p-invalid')}
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
