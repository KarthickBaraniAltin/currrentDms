import React from 'react'

import styles from '../Label/Label.module.css'

export default function Label({label, validations}) {

  return (
    <>
        <span className={styles.asteriks}>{validations?.required?.isRequired ? `* ` : null}</span>
        <label className={styles.labelStyle} >
            {label}
        </label>
    </> 
  )
}
