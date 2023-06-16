import React from 'react'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function HeaderDialog({ visible, hideDialog, inputs, handleInputChange, handleUpdate, assignValuesNested, setMetadata }) {
  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate} setMetadata={setMetadata}>
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='label' value={inputs?.label} onChange={assignValuesNested} />
        </div>
      </div>
    </SettingsContainer>
  )
}
