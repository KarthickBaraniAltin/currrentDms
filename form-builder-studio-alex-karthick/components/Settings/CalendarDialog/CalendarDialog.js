import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import ColumnSizeDropdowm from '../ColumnSizeDropdown/ColumnSizeDropdowm'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function CalendarDialog({ visible, hideDialog, assignValuesNested, inputs, handleInputChange, handleUpdate, setMetadata }) {
  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate} setMetadata={setMetadata}>
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Default Value</label>
          <Calendar className={SettingsStyle.advanceMenuInput} name='defaultValue' value={inputs?.defaultValue ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <ColumnSizeDropdowm name='divClassName' inputs={inputs} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Date</label>
          <Calendar className={SettingsStyle.advanceMenuInput} name='validations.dateLength.minDate' value={inputs?.validations?.dateLength?.minDate ?? undefined} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Date Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.dateLength.minMessage' value={inputs?.validations?.dateLength?.minMessage ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Date</label>
          <Calendar className={SettingsStyle.advanceMenuInput} name='validations.dateLength.maxDate' value={inputs?.validations?.dateLength?.maxDate ?? undefined} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Date Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.dateLength.maxMessage' value={inputs?.validations?.dateLength?.maxMessage ?? ''} onChange={handleInputChange} />
        </div>
      </div>
    </SettingsContainer>
  ) 
}
