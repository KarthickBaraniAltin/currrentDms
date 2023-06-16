import React from 'react'

import styles from '../DragButton/DragButton.module.css'

export default function DragButton({listeners}) {
  return (
    <div className={`mb-1 ${styles.container}`} {...listeners}>
        <i className={`pi pi-bars ${styles.handle}`} />
    </div>
  )
}
