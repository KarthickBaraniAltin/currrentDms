import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import clsx from 'clsx'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import { saveAs } from 'file-saver'

import sharedStyles from '../../../SharedComponents/File/File.module.css'
import styles from '../ViewFileInput/ViewFileInput.module.css'

export default function ViewFileInput({ metadata, value, onChange, errors }) {
  const { name, label, subtitle, disabled, multiple, validations } = metadata

  const downloadFile = async (file, fileName) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_FORM_BUILDER_API}/FormMetadata/file/${file.guid}` // Update this URL to the actual API endpoint
      const response = await fetch(apiUrl)

      if (response.ok) {
        const blob = await response.blob()
        saveAs(blob, `${fileName}`)
      } else {
        console.error(`Error while downloading the file: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error while downloading the file: ${error.message}`);
    }
  }

  return (
    <ComponenentContainer>
      <LabelContainer className={sharedStyles.labelContainer}>
        <Label label={label} validations={validations} />
      </LabelContainer>
      <InputsContainer>
        <input
            name={name} 
            className={clsx('col-12', sharedStyles.file, errors?.length > 0 && 'p-invalid')} 
            type='file' 
            onChange={onChange}
            multiple={multiple}
            disabled={disabled}
        />
        <Subtitle subtitle={subtitle} />
        <Errors errors={errors} />
        {value?.map((file) => {
          const regex = /filename="([^"]*)"/
          const match = file.contentDisposition.match(regex)
          let fileName = ''
          if (match && match[1]) {
            fileName = match[1]
            return (
              <div className={`${styles.fileDownloadWrapper}`} key={file.guid} onClick={() => downloadFile(file, fileName)}>
                <i className={`pi pi-file ${styles.fileDownloadIcon}`} />
                <label className={`${styles.fileDowloadLabel}`}>
                  {fileName}
                </label>
              </div>
            )
          } else {
            return (
              <></>
            )
          }
        })}
      </InputsContainer>
    </ComponenentContainer>
  )
}
