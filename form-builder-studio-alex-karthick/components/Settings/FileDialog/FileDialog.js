import React from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { MultiSelect } from 'primereact/multiselect'
import { Checkbox } from 'primereact/checkbox'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import ColumnSizeDropdowm from '../ColumnSizeDropdown/ColumnSizeDropdowm'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function FileDialog({ visible, hideDialog, inputs, assignValuesNested, handleInputChange, handleUpdate, setMetadata }) {

  const fileTypes = [
    { label: '.pdf', value: 'application/pdf' },
    { label: '.png', value: 'image/png' },
    { label: '.jpeg', value: 'image/jpeg' }
  ]
  console.log("Inputs:", inputs)

  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate} setMetadata={setMetadata}>
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
        </div>
        <div>
          <ColumnSizeDropdowm name='divClassName' inputs={inputs} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Multiple</label>
          <Checkbox name='multiple' checked={inputs?.multiple} className='ml-2' value={inputs?.multiple ?? false} onChange={e => assignValuesNested('multiple', e.checked)} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min File Size</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validations.fileLength.minFile' value={inputs?.validations?.fileLength?.minFile ?? 0} onChange={handleInputChange} format={false}/>
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min File Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.fileLength.minMessage' value={inputs?.validations?.fileLength?.minMessage ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max File Size</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validationsfileLength.maxFile' value={inputs?.validations?.fileLength?.maxFile ?? 0} onChange={handleInputChange} format={false}/>
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max File Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.fileLength.maxMessage' value={inputs?.validations?.fileLength?.maxMessage ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Acceptable File Types</label>
          <MultiSelect className={SettingsStyle.advanceMenuInput} name='validations.fileTypes.fileTypes' value={inputs?.validations?.fileTypes?.fileTypes ?? null} options={fileTypes} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>File Types Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.fileTypes.message' value={inputs?.validations?.fileTypes?.message ?? ''} onChange={handleInputChange} />
        </div>
      </div>
    </SettingsContainer>
  )
}
