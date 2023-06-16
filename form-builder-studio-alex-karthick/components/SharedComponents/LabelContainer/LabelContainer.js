import React from 'react'

import styles from '../LabelContainer/LabelContainer.module.css'
import clsx from 'clsx'

export default function LabelContainer({children, ...props}) {
  return (
    <div className={clsx('mr-2 mt-2', styles.labelContainer)}  {...props}>
        {children}
    </div>
  )
}