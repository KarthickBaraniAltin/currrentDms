import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import ColumnSizeDropdowm from '../ColumnSizeDropdown/ColumnSizeDropdowm'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import useDialogValidations from '../../../hooks/useDialogValidations'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function DropdownDialog({ visible, hideDialog, inputs, assignValuesNested, handleInputChange, handleUpdate, setMetadata }) {
  const [invalidOptions, setInvalidOptions] = useState(false)
  const { invalidDefaultValues } = useDialogValidations()

  const handleOptionChange = (index, event, type) => { //
    if (!inputs.options) {
      return
    }

    const value = event.target.value
    const newOptions = [...inputs?.options]

    if (!newOptions.some(option => option.label === inputs?.defaultValue)) {
      inputs.defaultValue = null
    }

    if (type === 'value') {
      newOptions[index] = {
        ...newOptions[index],
        label: value,
        value: type === 'value' ? value : newOptions[index].value
      }
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
      const newOptions = [{ label: '', value: '' }]
      assignValuesNested('options', newOptions)
      return
    }

    const newOptions = [...inputs.options, { label: '', value: '' }]
    assignValuesNested('options', newOptions)
  }

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
          {inputs?.name.startsWith('dropdown') ?
            <Dropdown className={SettingsStyle.advanceMenuInput} name='defaultValue' value={inputs?.defaultValue ?? ''} onChange={handleInputChange}
              options={inputs?.options} disabled={invalidDefaultValues(inputs?.options)} editable
            />
            :
            <MultiSelect className={SettingsStyle.advanceMenuInput} name='defaultValue' value={inputs?.defaultValue ?? ''} onChange={handleInputChange}
              options={inputs?.options} disabled={invalidDefaultValues(inputs?.options)}
            />
          }
        </div>
        <div>
          <ColumnSizeDropdowm name='divClassName' inputs={inputs} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel} style={{ marginBottom: '0.25rem' }}>Options</label>
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
        </div>
        <div style={{ color: '#003459' }}>
          <i className='pi pi-plus' onClick={() => handleAddOptions()}></i>
        </div>
      </div>
    </SettingsContainer>
  )
}
