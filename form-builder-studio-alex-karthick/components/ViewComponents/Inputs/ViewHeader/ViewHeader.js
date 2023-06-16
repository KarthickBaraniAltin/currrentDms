import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'
import Label from '../../../SharedComponents/Label/Label'
import ReadonlyLexicalEditor from '../../../LexicalEditor/ReadonlyLexicalEditor/ReadonlyLexicalEditor'

import styles from '../../../CreationComponents/Inputs/CreateHeader/CreateHeader.module.css'
import sharedImageStyles from '../../../CreationComponents/Inputs/CreateImage/CreateImage.module.css'
import clsx from 'clsx'

export default function ViewHeader({metadata, value}) {
    const { name, label, width, height, file } = metadata
    const [image, setImage] = useState()

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_FORM_BUILDER_API}/FormMetadata/file/${file.guid}` // Update this URL to the actual API endpoint
                const response = await fetch(apiUrl)
            
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`)
                }
            
                const blob = await response.blob()
                const reader = new FileReader()
            
                reader.onloadend = () => {
                    setImage(reader.result)
                }
            
                reader.readAsDataURL(blob)
              } catch (error) {
                console.error("Error fetching image:", error)
              }
        }

        if (file) {
            fetchImage()
        }
    }, [])


    return (
        <>
            <div className='field grid grid-nogutter'>       
                {(value || image) && 
                    <div className='col-4'>  
                        <div className={sharedImageStyles.imageWrapper} style={{width: width, height: height}}>
                            <NextImage src={value ?? image} alt="Uploaded" fill />                    
                        </div>
                    </div>
                }
                <div className='col-8'>
                    <ReadonlyLexicalEditor value={label} />
                </div>  
            </div>  
        </>
    )
}
