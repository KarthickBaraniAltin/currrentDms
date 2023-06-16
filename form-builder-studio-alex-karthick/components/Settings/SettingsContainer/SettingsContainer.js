import SettingsStyles from './SettingsContainer.module.css'
import { Button } from 'primereact/button'
import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import RequiredCheckbox from '../RequiredCheckbox/RequiredCheckbox'
import Image from 'next/image'
import SettingsGear from '../../../images/component_images/SettingsGear.png'
import Grid from '../../../images/component_images/Grid.png'
 
export default function SettingsContainer({ children, inputs, handleInputChange, hideMenu, handleUpdate, setMetadata, options, setInvalidOptions }) {
    const [activeIndex, setActiveIndex] = useState(1)
    const componentType = inputs.type?.charAt(0).toUpperCase() + inputs.type?.slice(1)

    // This code is for implementing the functionality described in task DW-278
    // useEffect(() => {
    //     setMetadata(prevState => {
    //         let tempMetadata = prevState
    //         tempMetadata[inputs.guid] = {...tempMetadata[inputs.guid], ...inputs}
    //         return tempMetadata
    //     })
    // }, [inputs])

    return (
        <div>
            <div className={SettingsStyles.header}>
                <div>
                    <div style={{marginBottom: '0.5rem'}}>{`${componentType} Field Settings`}</div>
                    <Button label='Close' onClick={hideMenu} className={SettingsStyles.accordionContentInput} style={{marginRight: '0.5rem'}} />
                    <Button label='Update' onClick={() => handleUpdate(false, options, setInvalidOptions)} className={SettingsStyles.accordionContentInput} style={{marginRight: '0.5rem'}} />
                    <Button label='Delete' onClick={() => handleUpdate(true)} className={SettingsStyles.accordionContentInput} />
                </div>
            </div>
            <div className={SettingsStyles.accordion}>
                <div className={SettingsStyles.accordionTitle} style={{cursor: 'pointer'}} onClick={() => setActiveIndex(1)}>
                    <Image src={SettingsGear} width={24} height={24} />
                    <div>General</div>
                </div>
                {activeIndex === 1 && 
                <div className={SettingsStyles.accordionContent}>
                    <div className={SettingsStyles.accordionContentMarginBottom}>
                        <label className={SettingsStyles.accordionContentLabel}>Label</label>
                        <InputText name='label' value={inputs?.label ?? ''} onChange={handleInputChange} />
                    </div>
                    <div className={SettingsStyles.accordionContentMarginBottom}>
                        <label className={SettingsStyles.accordionContentLabel}>Backend Name</label>
                        <InputText name='name' value={inputs?.name ?? ''} onChange={handleInputChange} />
                    </div>
                    <div className={SettingsStyles.accordionContentMarginBottom}>
                        <RequiredCheckbox inputs={inputs} onChange={handleInputChange} />
                    </div>
                </div>}
                <div className={SettingsStyles.accordion}>
                    <div className={SettingsStyles.accordionTitle} style={{cursor: 'pointer'}} onClick={() => setActiveIndex(2)}>
                        <Image src={Grid} width={24} height={24} />
                        <div>Advance</div>
                    </div>
                    {activeIndex === 2 &&  children}
                </div>
            </div>
        </div>
    )
}