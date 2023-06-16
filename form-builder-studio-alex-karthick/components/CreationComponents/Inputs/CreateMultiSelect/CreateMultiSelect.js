import { MultiSelect } from 'primereact/multiselect'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import sharedStyles from '../../../SharedComponents/Dropdown/Dropdown.module.css'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

export default function CreateMultiSelect({ metadata, openDialog, value, onChange, errors, setMetadata }) {
  const { name, validations, label, subtitle, options, defaultValue } = metadata

  return (
    <ComponenentContainer>
        <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
        <LabelContainer>
          <Label label={label} validations={validations} />
        </LabelContainer>
        <InputsContainer>
          <MultiSelect 
            name={name} 
            className={`col-12 ${sharedStyles.dropdown}`} 
            value={value ?? defaultValue} 
            onChange={onChange} 
            options={options} 
            display='chip' 
          />        
          <Subtitle subtitle={subtitle} />
          <Errors errors={errors} />
        </InputsContainer>
    </ComponenentContainer>
  )
}
