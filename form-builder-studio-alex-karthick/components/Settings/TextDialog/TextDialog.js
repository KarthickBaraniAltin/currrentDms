import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import ColumnSizeDropdowm from '../ColumnSizeDropdown/ColumnSizeDropdowm'
import Footer from '../Footer/Footer'
import RequiredCheckbox from '../RequiredCheckbox/RequiredCheckbox'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function TextDialog({ visible, hideDialog, inputs, assignValuesNested, handleInputChange, handleUpdate, setMetadata }) {
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
          <ColumnSizeDropdowm name='divClassName' inputs={inputs} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Length</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validations.textLength.minLength' value={inputs?.validations?.textLength?.minLength ?? 0} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Length Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.textLength.minMessage' value={inputs?.validations?.textLength?.minMessage ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Length</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validations.textLength.maxLength' value={inputs?.validations?.textLength?.maxLength ?? 255} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Length Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.textLength.maxMessage' value={inputs?.validations?.textLength?.maxMessage ?? ''} onChange={handleInputChange} />
        </div>
      </div>
    </SettingsContainer>
  )
}
