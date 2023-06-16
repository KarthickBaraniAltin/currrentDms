import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import ColumnSizeDropdowm from '../ColumnSizeDropdown/ColumnSizeDropdowm'
import { MultiSelect } from 'primereact/multiselect'
import useDialogValidations from '../../../hooks/useDialogValidations'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function CheckboxDialog({ visible, hideDialog, inputs, assignValuesNested, handleInputChange, handleUpdate, setMetadata }) {
  const [invalidOptions, setInvalidOptions] = useState(false)
  const { invalidDefaultValues } = useDialogValidations()

  const handleOptionChange = (index, event, type) => {
    if (!inputs.options) {
      return
    }

    const value = event.target.value
    const newOptions = [...inputs?.options]

    if (!newOptions.some(option => option.label === inputs?.defaultValue)) {
      inputs.defaultValue = null
    }

    if (type === 'value') {
      newOptions[index] = { ...newOptions[index], value: value }
      assignValuesNested('options', newOptions)
    } else {
      console.error("Unknown Type")
    }
  }

  const handleDeleteOptions = (index) => {
    const newOptions = [...inputs?.options]
    newOptions.splice(index, 1)
    assignValuesNested('options', newOptions)
  }

  const handleAddOptions = () => {
    if (!inputs.options) {
      const newOptions = [{ value: '' }]
      assignValuesNested('options', newOptions)
      return
    }

    const newOptions = [...inputs.options, { value: '' }]
    assignValuesNested('options', newOptions)
  }

  const convertedOptions = inputs?.options.map(option => option.value)

  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate}
      options={inputs?.options} setInvalidOptions={setInvalidOptions} setMetadata={setMetadata}
    >
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Default Value</label>
          <MultiSelect className={SettingsStyle.advanceMenuInput} name='defaultValue' value={inputs?.defaultValue ?? ''} onChange={handleInputChange}
            options={convertedOptions} disabled={invalidDefaultValues(inputs?.options)}
          />
        </div>
        <div>
          <ColumnSizeDropdowm name='divClassName' inputs={inputs} onChange={handleInputChange} />
        </div>
        <label className={SettingsStyle.accordionContentLabel}>Options</label>
        {
          inputs?.options?.map((option, index) => {
            return (
              <div key={index} style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', columnGap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className={SettingsStyle.accordionContentLabel}>Value</label>
                  <InputText autoComplete='off' name={`option-${index}`} value={option.value} style={{width: '68%'}} onChange={(event) => handleOptionChange(index, event, 'value')} />
                  <Button className='p-button-rounded p-button-danger' icon='pi pi-trash' onClick={() => handleDeleteOptions(index)} />
                </div>
                <small style={{ color: 'red' }}>{invalidOptions && option.value === '' ? 'Value Required' : ''}</small>
              </div>
            )
          })
        }
        <div>
          <i style={{ color: '#003459' }} className='pi pi-plus' onClick={() => handleAddOptions()}></i>
        </div>
      </div>
    </SettingsContainer>
  )
}