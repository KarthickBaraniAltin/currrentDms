import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import LexicalEditor from '../../LexicalEditor/LexicalEditor';
import ColumnSizeDropdowm from '../ColumnSizeDropdown/ColumnSizeDropdowm'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function TimeDialog({ visible, hideDialog, assignValuesNested, inputs, handleInputChange, handleUpdate, setMetadata }) {
  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate} setMetadata={setMetadata}>
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Default Value</label>
          <Calendar className={SettingsStyle.advanceMenuInput} showTime timeOnly hourFormat='12' name='defaultValue' value={inputs?.defaultValue ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <ColumnSizeDropdowm name='divClassName' inputs={inputs} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Time</label>
          <Calendar className={SettingsStyle.advanceMenuInput} showTime timeOnly hourFormat='12' name='validations.timeLength.minTime' value={inputs?.validations?.timeLength?.minTime ?? undefined} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Time Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.timeLength.minMessage' value={inputs?.validations?.timeLength?.minMessage ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Time</label>
          <Calendar className={SettingsStyle.advanceMenuInput} showTime timeOnly hourFormat='12' name='validations.timeLength.maxTime' value={inputs?.validations?.timeLength?.maxTime ?? undefined} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Time Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.timeLength.maxMessage' value={inputs?.validations?.timeLength?.maxMessage ?? ''} onChange={handleInputChange} />
        </div>
      </div>
    </SettingsContainer>
  )
}