import LexicalEditor from '../../../LexicalEditor/LexicalEditor'
import React from 'react'
import Errors from '../../../SharedComponents/Errors/Errors'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import ComponentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'

import styles from '../ViewRichText/ViewRichText.module.css'

export function ViewRichText({ metadata, value, assignValuesNested, errors }) {
    const { name, label, subtitle, disabled } = metadata

    return (
        <ComponentContainer> 
            <LabelContainer className={`${styles.labelContainerRichText} mr-2`}> 
                <Label label={label} />
            </LabelContainer>
            <InputsContainer className={styles.inputsContainerRichText}>
                <LexicalEditor name={name} value={value} onChange={assignValuesNested} readOnly={disabled} /> 
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}