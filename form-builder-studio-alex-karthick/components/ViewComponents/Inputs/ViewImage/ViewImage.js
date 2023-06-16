import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'

import styles from '../ViewImage/ViewImage.module.css'
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'

export default function ViewImage({metadata, value}) {
    const { name, label, subtitle, width, height, file } = metadata
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
            <ComponenentContainer>
                <LabelContainer className={`${styles.labelContainer} mr-2`}>
                    <Label label={label} />
                </LabelContainer>      
                <InputsContainer className={`${styles.inputsContainer} mb-3`}>
                    {(value || image) && 
                        <div className={styles.imageWrapper} style={{ width: width, height: height}}>
                            <Image src={value ?? image} alt="Uploaded" fill />                    
                        </div>
                    }
                    <Subtitle subtitle={subtitle} />
                </InputsContainer>          
            </ComponenentContainer>
        </>
    )
}
