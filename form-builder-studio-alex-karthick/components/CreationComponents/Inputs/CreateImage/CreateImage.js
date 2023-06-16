import NextImage from 'next/image';
import React, { useEffect } from 'react'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../../SettingsButton/SettingsButton'
import 'react-resizable/css/styles.css';
import Label from '../../../SharedComponents/Label/Label';
import '../CreateImage/CreateImage.module.css'
import { Resizable } from 're-resizable';
import clsx from 'clsx';
import ComponenentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer';
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer';
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer';

import styles from '../CreateImage/CreateImage.module.css'
import sharedStyles from '../../../SharedComponents/Image/Image.module.css'

export default function CreateImage({ metadata, assignValuesNested, setMetadata, guid, value, openDialog, errors, setFiles, setInputs }) {
    const { name, label, subtitle, width, height, aspectRatio, file } = metadata

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
                    setInputs(prevInputs => ({ ...prevInputs, [name]: reader.result }));
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

    const updateMetadata = (width, height, aspectRatio = aspectRatio) => {
        setMetadata((prevMetadata) => {
            const currentComponentData = prevMetadata[guid] || {}
            const updatedComponentData = {
              ...currentComponentData,
              width: width,
              height: height,
              aspectRatio: aspectRatio
            }

            return {
              ...prevMetadata,
              [guid]: updatedComponentData,
            }
        })
    }

    const handleResize = (event, direction, ref, delta) => {
        // const newAspectRatio = lockAspectRatio ? aspectRatio : height / width
        updateMetadata(ref.style.width, ref.style.height, aspectRatio)
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        
        setFiles((prevFiles) => ({
            ...prevFiles,
            [event.target.name]: file,
        }))

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                assignValuesNested(name, e.target.result)

                const img = new Image()
                img.src = e.target.result
                img.onload = () => {
                    const aspectRatio = width / height                  
                    updateMetadata('100%', '100%', aspectRatio)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <ComponenentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} />
            <LabelContainer className={`${styles.labelContainer} mr-2`}>
                <Label label={label} />
                <input name={guid} type='file' accept="image/jpeg,image/png"  multiple={false} onChange={handleImageUpload} />                
            </LabelContainer>
            <InputsContainer className={styles.inputsContainer}>
                {value &&
                    <Resizable 
                        size={{width, height}}
                        onResizeStop={handleResize}                      
                        lockAspectRatio={true}   
                        maxWidth={'100%'}
                        minWidth={40}
                        enable={{
                            right: true,
                        }}
                        defaultSize={{
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        {// eslint-disable-next-line @next/next/no-img-element
                            <div className={clsx(styles.imageWrapper, styles.rightBorder)}>
                                <NextImage src={value ?? image} alt="Uploaded" fill />                    
                            </div>
                        }
                    </Resizable>
                }
                <Subtitle subtitle={subtitle} />
            </InputsContainer>
        </ComponenentContainer>
    )
}
