import React from 'react'

import styles from '../Errors/Errors.module.css'
import clsx from 'clsx'

export default function Errors({errors}) {
    return (
        <>
            {errors && 
                <div className={clsx('col-12', styles.noPadding)} >
                    {  errors?.map((element, index) => {
                            return (
                                <div key={index}>
                                    <small className="pi pi-exclamation-circle p-error" style={{fontSize: '15px'}}></small>
                                    <small key={element} className='p-error ml-1'>{element}</small> 
                                </div>
                            )
                        })
                    }
                </div>
            }
        </>
    )
}
