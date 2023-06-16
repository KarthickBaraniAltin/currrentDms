import React from 'react'

import styles from '../InputsContainer/InputsContainer.module.css'
import clsx from 'clsx'

export default function InputsContainer({children, ...props}) {
  return (
    <div className={clsx('col-8')}  {...props}>
        {children}
    </div>
  )
}
