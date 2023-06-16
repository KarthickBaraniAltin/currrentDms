import React from 'react'
import { InputText } from 'primereact/inputtext'
import LexicalEditor from '../../LexicalEditor/LexicalEditor';
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function ImageDialog({ visible, hideDialog, inputs, assignValuesNested, handleInputChange, handleUpdate, setMetadata }) {
  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate} setMetadata={setMetadata}>
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Width %</label>
          <InputText className={SettingsStyle.advanceMenuInput} disabled name='width' value={inputs?.width ?? 0} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Height %</label>
          <InputText className={SettingsStyle.advanceMenuInput} disabled name='height' value={inputs?.height ?? '0'} onChange={handleInputChange} />
        </div>
      </div>
    </SettingsContainer>
  )
}
