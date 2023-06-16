import React from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import LexicalEditor from '../../LexicalEditor/LexicalEditor';
import ColumnSizeDropdowm from '../ColumnSizeDropdown/ColumnSizeDropdowm'
import SettingsContainer from '../SettingsContainer/SettingsContainer'
import SettingsStyle from '../SettingsContainer/SettingsContainer.module.css'

export default function NumberDialog({ visible, hideDialog, assignValuesNested, inputs, handleInputChange, handleUpdate, setMetadata }) {
  return (
    <SettingsContainer inputs={inputs} handleInputChange={handleInputChange} hideMenu={hideDialog} handleUpdate={handleUpdate} setMetadata={setMetadata}>
      <div className={SettingsStyle.accordionContent} style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Subtitle</label>
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Default Value</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='defaultValue' value={inputs?.defaultValue ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <ColumnSizeDropdowm name='divClassName' inputs={inputs} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Number</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validations.numLength.minNum' value={inputs?.validations?.numLength?.minNum ?? 0} onValueChange={handleInputChange} format={false}/>
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Min Number Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.numLength.minMessage' value={inputs?.validations?.numLength?.minMessage ?? ''} onChange={handleInputChange} />
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Number</label>
          <InputNumber className={SettingsStyle.advanceMenuInput} name='validations.numLength.maxNum' value={inputs?.validations?.numLength?.maxNum ?? 1000} onValueChange={handleInputChange} format={false}/>
        </div>
        <div>
          <label className={SettingsStyle.accordionContentLabel}>Max Number Message</label>
          <InputText className={SettingsStyle.advanceMenuInput} name='validations.numLength.maxMessage' value={inputs?.validations?.numLength?.maxMessage ?? ''} onChange={handleInputChange} />
        </div>
      </div>
    </SettingsContainer>
  )
}
