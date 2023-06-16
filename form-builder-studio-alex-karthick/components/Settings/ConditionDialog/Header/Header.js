import React from 'react'

import styles from '../Header/Header.module.css'

export default function Header({label}) {
  return (  
        <div className={`col-4 mt-2 ${styles.header}`}>
            {label}
        </div>
    )
}
