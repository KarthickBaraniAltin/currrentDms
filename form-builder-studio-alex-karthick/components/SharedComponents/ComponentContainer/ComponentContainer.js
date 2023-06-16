import React from 'react'

import styles from '../ComponentContainer/ComponentContainer.module.css'

export default function ComponenentContainer({children, ...props}) {
  return (
    <div className='field grid grid-nogutter' {...props}>
        {children}
    </div>
  )
}
