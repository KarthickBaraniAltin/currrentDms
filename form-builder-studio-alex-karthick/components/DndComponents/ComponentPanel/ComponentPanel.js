import { Draggable } from '../Draggable/Draggable'
import { useState } from 'react'
import Image from 'next/image'
import TextFields from '../../../images/component_images/TextFields.png'
import ChoiceFields from '../../../images/component_images/ChoiceFields.png'
import H2Image from '../../../images/component_images/h2_Image.png'
import styles from './ComponentPanel.module.css'

export const fullSizeClassName = 'col-11 mlr-05'
export const halfSizeClassName = 'col-5 mlr-05'

export default function ComponentPanel() {
    const [textfieldsVisible, setTextfieldsVisible] = useState(false)
    const [choicefieldsVisible, setChoicefieldsVisible] = useState(false)

    const componentTypes = [
        'header',
        'image',
        'text',
        'textarea',
        'richText',
        'calendar',
        'time',
        'number',
        'file',
        'dropdown',
        'multiselect',
        'radiobutton',
        'checkbox',
        'mask',
        'subtitle',
        'signature',
        // 'address'
    ]

    const textfields = ['text', 'textarea', 'richText']
    const choicefields = ['dropdown', 'multiselect', 'radiobutton', 'checkbox']

    const componentNames = [
        'Header',
        'Image',
        'Short Text',
        'Large Text',
        'Rich Text',
        'Date Picker',
        'Time',
        'Number',
        'File Upload',
        'Dropdown',
        'Multiselect',
        'Single Choice',
        'Multiple Choice',
        'Mask',
        'Paragraph',
        'Signature',
        // 'Address'
    ]

    const defaultSubtitle = JSON.stringify({"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}})
    let optionCounter = 0

    const createOption = (component, index) => {
        const divSize = component === 'header' || component === 'textarea' || component === 'richText'
            || component === 'image' || component === 'subtitle' || component === 'address' ? fullSizeClassName : halfSizeClassName

        const label = component === 'header' ? defaultSubtitle : component.charAt(0).toUpperCase() + component.slice(1)
        const subtitle = component === 'header' ? null : defaultSubtitle

        const options = component === 'dropdown' || component === 'multiselect' || component === 'radiobutton'
            || component === 'checkbox' ? [] : null

        const labelSize = component === "text" || component === "textarea" || component === "richText" ||
        component === "dropdown" || component === "multiselect" || component === "radiobutton" || component === "checkbox"
        ? "14px" : "1rem"

        optionCounter++

        return (
            <Draggable
                key={index}
                id={`${index + 1}`}
                type={component}
                name={component}
                guid=''
                divClassName={divSize}
                label={label}
                subtitle={subtitle}
                defaultValue=''
                dateFormat={component === 'calendar' ? 'dd-mm-yy' : ''}
                minDate=''
                maxDate=''
                showTime={component === 'time' ? true : false}
                timeOnly={component === 'time' ? true : false}
                hourFormat={component === 'time' ? '12' : ''}
                format={false}
                mask={component === 'mask' ? '(999) 999-9999' : ''}
                options={options}
                otherOptions={false}
                fontStyle=''
            >
                <label style={{fontSize: labelSize}}>{component === 'address' ? 'Address' : componentNames[index]}</label>
            </Draggable>
        )
    }

    const createAccordion = (component, index, isVisible, setIsVisible) => {
        if (component === 'text') {
            let textComponents = []
            let textfieldIndex = index

            for (const textfield of textfields) {
                textComponents.push(createOption(textfield, textfieldIndex))
                textfieldIndex += 1
            }

            return (
                <div style={{padding: '0 1rem'}}>
                    <div className={styles.accordion}>
                        <Image src={TextFields} width={24} height={24} />
                        <label className={styles.accordionField}>{'Text Field'}</label>
                        <span className={styles.accordionButton} style={{transform: isVisible ? "rotate(180deg)" : ""}} onClick={() => setIsVisible(prev => !prev)}>
                            <i className="pi pi-angle-down" style={{fontSize: "1.4rem"}} />
                        </span>
                    </div>
                    {isVisible && component === 'text' ? textComponents : ''}
                </div>
            )
        }

        if (component === 'dropdown') {
            let choiceComponents = []
            let choicefieldIndex = index

            for (const choicefield of choicefields) {
                choiceComponents.push(createOption(choicefield, choicefieldIndex))
                choicefieldIndex += 1
            }

            return (
                <div style={{padding: '0 1rem'}}>
                    <div className={styles.accordion}>
                        <Image src={ChoiceFields} width={24} height={24} />
                        <label className={styles.accordionField}>{'Choice Field'}</label>
                        <span className={styles.accordionButton} style={{transform: isVisible ? "rotate(180deg)" : ""}} onClick={() => setIsVisible(prev => !prev)}>
                            <i className="pi pi-angle-down" style={{fontSize: "1.4rem"}} />
                        </span>
                    </div>
                    {isVisible && component === 'dropdown' ? choiceComponents : ''}
                </div>
            )
        }
    }

    const componentList = componentTypes.map((component, index) => {
        if (component === 'text') {
            return createAccordion(component, index, textfieldsVisible, setTextfieldsVisible)
        } else if (component === 'textarea' || component === 'richText') {
            return
        }

        if (component === 'dropdown') {
            return createAccordion(component, index, choicefieldsVisible, setChoicefieldsVisible)
        } else if (component === 'multiselect' || component === 'radiobutton' || component === 'checkbox') {
            return
        }

        return createOption(component, index)
    })

    return(
        <div style={{width: '320px', backgroundColor: '#F7F9FA'}}>
            <div style={{display: 'flex', alignItems: 'center', padding: '0 1rem', margin: '0.5rem 0'}}>
                <Image alt='image' src={H2Image} width={36} height={36} />
                <h2 style={{color: '#003459'}}>Building Blocks</h2>
            </div>
            {componentList}
            <div className={styles.horizontalLine}></div>
            <div style={{display: 'flex', alignItems: 'center', padding: '0 1rem', margin: '0.5rem 0'}}>
                <Image alt='image' src={H2Image} width={36} height={36} />
                <h2 style={{color: '#003459'}}>Templates</h2>
            </div>
            {createOption('address', optionCounter + 1)}
        </div>
    )
}

