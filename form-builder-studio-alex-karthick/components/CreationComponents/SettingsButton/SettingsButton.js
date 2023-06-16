import React, { useEffect, useState } from 'react'
import styles from '../SettingsButton/SettingsButton.module.css'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import { useInputs } from '../../../hooks/useInput'
import { Button } from 'primereact/button'

export default function SettingsButton({ openDialog, componentData, setMetadata }) {
  const { inputs, setInputs, assignValuesNested } = useInputs({ initialValues: {} })
  useEffect(() => {
    openDialog(componentData)
  }, [])

  const [showTooltip, setShowTooltip] = useState(false)

  const handleTooltipClick = () => {
    setShowTooltip(true)
    setInputs(componentData)
  }

  const handleTooltipClose = () => {
    setShowTooltip(false)
  }

  const handleTooltipUpdate = () => {
    setShowTooltip(false)

    setMetadata(metadata => {
      const updatedObj = {
        ...metadata[componentData.guid],
        subtitle: inputs.subtitle
      }

      return {
        ...metadata,
        [componentData.guid]: updatedObj
      }
    })
  }

  return (
    <div className='col-12 flex justify-content-end'>
      <i
        className={`pi pi-cog ${styles.settings}`}
        style={{ marginRight: '0.2rem' }}
        onClick={() => openDialog(componentData)}
      ></i>
      <i
        className={`pi pi-caret-down ${styles.settings}`}
        onClick={handleTooltipClick}
      ></i>
      {showTooltip && (
        <div
          className={styles.tooltip}
        >
          <LexicalEditor name='subtitle' value={inputs?.subtitle ?? ''} onChange={assignValuesNested} />
          <Button label='Close' className={styles.tooltipButton} onClick={handleTooltipClose} />
          <Button label='Update' className={styles.tooltipButton} onClick={handleTooltipUpdate} />
        </div>
      )}
    </div>
  );

  // return (
  //   <div className='col-12 flex justify-content-end'>
  //     <i className={`pi pi-cog ${styles.settings}`} style={{marginRight: '0.2rem'}} onClick={() => openDialog(componentData)}></i>       
  //     <i className={`pi pi-caret-down ${styles.settings}`}></i>
  //   </div>
  // )
}
