import React from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function TextareaDialog({ visible, hideDialog, inputs, assignValuesNested, handleInputChange, handleUpdate, setMetadata }) {
  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate} setMetadata={setMetadata}>
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Default Value</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='defaultValue' value={inputs?.defaultValue ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Length</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validations.textLength.minLength' value={inputs?.validations?.minLength?.length ?? 0} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Length Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.textLength.minMessage' value={inputs?.validations?.minLength?.message ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Length</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validations.textLength.maxLength' value={inputs?.validations?.maxLength?.length ?? 255} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Length Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.textLength.maxMessage' value={inputs?.validations?.maxLength?.message ?? ''} onChange={handleInputChange} />
        </div>
      </div>
    </SettingsContainer>
  )
}
