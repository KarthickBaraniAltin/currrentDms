import React, { createElement, useState, useEffect } from 'react'
import ViewComponentContainer from './ViewComponentContainer/ViewComponentContainer'
import clsx from 'clsx'
import NextImage from 'next/image'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import ReadonlyLexicalEditor from '../../LexicalEditor/ReadonlyLexicalEditor/ReadonlyLexicalEditor'
import viewStyles from './ViewComponent.module.css'
import textStyles from '../../SharedComponents/Text/Text.module.css'
import headerAndImageStyles from '../../SharedComponents/HeaderAndImage/HeaderAndImage.module.css'
import calendarStyles from '../../SharedComponents/Calendar/Calendar.module.css'
import numberStyles from '../../SharedComponents/Number/Number.module.css'
import textareaStyles from '../../SharedComponents/Textarea/Textarea.module.css'
import maskStyles from '../../SharedComponents/Mask/Mask.module.css'
import dropdownStyles from '../../SharedComponents/Dropdown/Dropdown.module.css'
import fileStyles from '../../SharedComponents/File/File.module.css'
import signatureStyles from '../../SharedComponents/Signature/Signature.module.css'
import addressStyles from '../../SharedComponents/Address/Address.module.css'
import Errors from '../../SharedComponents/Errors/Errors'
import Label from '../../SharedComponents/Label/Label'
import Subtitle from '../../SharedComponents/Subtitle/Subtitle'
import LabelContainer from '../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../SharedComponents/InputsContainer/InputsContainer'
import ComponentContainer from '../../SharedComponents/ComponentContainer/ComponentContainer'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputMask } from 'primereact/inputmask'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { RadioButton } from 'primereact/radiobutton'
import { Checkbox } from 'primereact/checkbox'
import { AutoComplete } from 'primereact/autocomplete'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/router'
import DisplaySignatureInfo from '../DisplaySignatureInfo/DisplaySignatureInfo'
import { useMsal, useAccount } from '@azure/msal-react'

export default function ViewComponents({ metadata, inputs, handleInputChange, assignValuesNested, errors, conditions, validationMapper, formSubmission, formDefinitionData, disabled }) {

    const componentMapper = {
        'header': ViewHeader,
        'text': ViewText,
        'calendar': ViewCalendar,
        'time': ViewTime,
        'number': ViewNumber,
        'textarea': ViewTextarea,
        'mask': ViewMask,
        'dropdown': ViewDropdown,
        'multiselect': ViewMultiselect,
        'image': ViewImage,
        'file': ViewFileInput,
        'richText': ViewRichText,
        'subtitle': ViewReadonlySubtitle,
        'signature': ViewSignature,
        'radiobutton': ViewMultiRadioButtons,
        'checkbox': ViewCheckbox,
        'address': ViewAddress
    }

    // const expressionsValidator = () => {
    //     if (!condition || !condition.expressions) {
    //         return
    //     }
    //     const { expressions } = condition
    //     const currentMetadata = metadata

    //     Object.entries(expressions).map(([key, value]) => {
    //         const component = metadata[key]
    //         const input = inputs?.[component.name] ?? undefined

    //         const { type, rule, val } = value
    //         const { validation, expectedResult } = rule

    //         const func = validationMapper[rule.validation]

    //         if (validation === 'isFilled') {
    //             if (validationMapper[validation](input) !== expectedResult) {
    //                 return false
    //             }
    //         } 

    //     })

    //     return true
    // }

    const updateMetadataWithConditions = () => {
        let viewMetadata = { ...metadata }

        if (!conditions) {
            return viewMetadata
        }


        for (const [key, value] of Object.entries(conditions)) {
            const { expressions, actions } = value

            let expressionsResult = true
            for (const [key, value] of Object.entries(expressions)) {
                if (!value) {
                    return viewMetadata
                }

                const { field } = value;
                if (!metadata[field]) {
                    console.warn("Expressions is not valid: ", expressions);
                    return viewMetadata
                }

                const inputValue = inputs[metadata[field].name]
                if (!evaluateExpression(value, inputValue)) {
                    expressionsResult = false
                }
            }


            for (const [key, value] of Object.entries(actions)) {
                const { rule, fields } = value

                if (expressionsResult) {
                    switch (rule) {
                        case 'Hide':
                            fields.forEach((field) => {
                                delete viewMetadata[field]
                            })
                            break
                        case 'Show':
                            fields.forEach((field) => {
                                viewMetadata[field] = metadata[field]
                            })
                            break
                        case 'Disable':
                            fields.forEach((field) => {
                                viewMetadata[field].disabled = true
                            })
                            break
                        case 'Enable':
                            fields.forEach((field) => {
                                viewMetadata[field].disabled = false
                            })
                            break
                    }
                } else {
                    switch (rule) {
                        case 'Show':
                            fields.forEach((field) => {
                                delete viewMetadata[field]
                            })
                            break
                        case 'Hide':
                            fields.forEach((field) => {
                                viewMetadata[field] = metadata[field]
                            })
                            break
                        case 'Enable':
                            fields.forEach((field) => {
                                viewMetadata[field].disabled = true
                            })
                            break
                        case 'Disable':
                            fields.forEach((field) => {
                                viewMetadata[field].disabled = false
                            })
                            break
                    }
                }
            }
        }

        // Checking the validity of expressions


        // Applying actions
        // if (expressionsResult) {
        //     Object.entries(actions).map(([key, value]) => {
        //         const { fields, rule } = value

        //         if (!rule) {

        //         }

        //         switch (rule) {
        //             case '':

        //                 break
        //         }

        //     })
        // }
        return viewMetadata
    }

    const applyAction = (action, input) => {

    }


    const evaluateExpression = (expression, input) => {
        console.log("Evaludating expression = ", expression)
        const { type, rule, val } = expression
        const { validation, expectedResult } = rule

        switch (validation) {
            case 'isFilled':
                if (validationMapper[validation](input) !== expectedResult) {
                    return false
                }
                break
            case 'stringContains':
                if (validationMapper[validation](input, val) !== expectedResult) {
                    return false
                }
                break
            case 'maxDate':
                if (validationMapper[validation](val, input) !== expectedResult) {
                    return false
                }
                break
            case 'minDate':
                if (validationMapper[validation](val, input) !== expectedResult) {
                    return false
                }
                break
        }

        return true
    }

    const viewMetadata = updateMetadataWithConditions()

    return (
        <div className='grid grid-nogutter'>
            {viewMetadata && Object.keys(viewMetadata).map(guid => {
                const { name, type, divClassName } = viewMetadata[guid]
                let currentMetadata = viewMetadata[guid]

                if (disabled) {
                    currentMetadata.disabled = true
                }

                return (
                    <ViewComponentContainer key={guid} className={clsx(divClassName ?? 'field col-6', 'mt-1')}>
                        {createElement(
                            componentMapper[type],
                            {
                                metadata: currentMetadata,
                                value: inputs[name],
                                onChange: handleInputChange,
                                errors: errors[name],
                                assignValuesNested: assignValuesNested,
                                formSubmission,
                                formDefinitionData: formDefinitionData
                            }
                        )}
                    </ViewComponentContainer>
                )
            })}
        </div>
    )
}

export function ViewHeader({metadata, value}) {
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
                        <div className={headerAndImageStyles.imageWrapper} style={{width: width, height: height}}>
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

export function ViewText({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, defaultValue, validations } = metadata
    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputText 
                    className={clsx('col-12', textStyles.inputText, errors?.length > 0 && 'p-invalid')} 
                    name={name} 
                    value={value ?? defaultValue} 
                    onChange={onChange}
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewCalendar({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, defaultValue, validations, disabled } = metadata
    const convertDataFormat = defaultValue ? new Date(defaultValue) : null

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer className={clsx('col-8')}>
                <Calendar
                    className={clsx('col-12', calendarStyles.calendar, errors?.length > 0 && 'p-invalid')}
                    name={name}
                    value={value ?? convertDataFormat}
                    onChange={onChange}
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewTime({metadata, value, onChange, errors}) {  
    const { name, disabled, label, subtitle, defaultValue, validations } = metadata
    const convertDataFormat = defaultValue ? new Date(defaultValue) : null

    return (
      <ComponentContainer> 
        <LabelContainer>
            <Label label={label} validations={validations} />
        </LabelContainer>   
        <InputsContainer>
          <Calendar 
            className={clsx('col-12', calendarStyles.calendar, errors?.length > 0 && 'p-invalid')} 
            timeOnly 
            showTime 
            hourFormat='12' 
            name={name} 
            value={value ?? convertDataFormat} 
            onChange={onChange}
            disabled={disabled}
          />
          <Subtitle subtitle={subtitle} />
          <Errors errors={errors} />
        </InputsContainer>
      </ComponentContainer>
    )
}

export function ViewNumber({ metadata, value, onChange, errors, invalidStyle }) {
    const { name, label, subtitle, disabled, defaultValue, validations } = metadata

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputNumber 
                    className={clsx('col-12', numberStyles.number, errors?.length > 0 && 'p-invalid')} 
                    name={name} 
                    value={value ?? defaultValue} 
                    onChange={onChange} 
                    useGrouping={false} 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export  function ViewTextarea({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, defaultValue, validations } = metadata

    return (
        <ComponentContainer>
            <LabelContainer className={`${textareaStyles.textareaLabel} ${viewStyles.labelWidthContainer}`}>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer className={viewStyles.inputsContainer}>
                <InputTextarea 
                    className={clsx('col-12', textareaStyles.textareaInput, errors?.length > 0 && 'p-invalid')} 
                    name={name} 
                    value={value ?? defaultValue} 
                    autoResize 
                    onChange={onChange} 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewMask({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, defaultValue, disabled, mask, validations } = metadata

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputMask
                    className={clsx('col-12', maskStyles.mask, errors?.length > 0 && 'p-invalid')}
                    name={name}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    mask={mask} 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewDropdown({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, options, validations, defaultValue } = metadata

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <Dropdown
                    name={name}
                    className={clsx('col-12', dropdownStyles.dropdown, errors?.length > 0 && 'p-invalid')}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    options={options} 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewMultiselect({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, options, validations, defaultValue } = metadata

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <MultiSelect
                    className={clsx('col-12', dropdownStyles.dropdown, errors?.length > 0 && 'p-invalid')}
                    name={name}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    options={options} 
                    display='chip' 
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewImage({ metadata, value }) {
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
            <ComponentContainer>
                <LabelContainer className={`${viewStyles.labelContainer} mr-2`}>
                    <Label label={label} />
                </LabelContainer>      
                <InputsContainer className={`${viewStyles.inputsContainer} mb-3`}>
                    {(value || image) && 
                        <div className={viewStyles.imageWrapper} style={{ width: width, height: height}}>
                            <NextImage src={value ?? image} alt="Uploaded" fill />                    
                        </div>
                    }
                    <Subtitle subtitle={subtitle} />
                </InputsContainer>          
            </ComponentContainer>
        </>
    )
}

export function ViewFileInput({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, multiple, validations } = metadata
  
    const downloadFile = async (file, fileName) => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_FORM_BUILDER_API}/FormMetadata/file/${file.guid}` // Update this URL to the actual API endpoint
        const response = await fetch(apiUrl)
  
        if (response.ok) {
          const blob = await response.blob()
          saveAs(blob, `${fileName}`)
        } else {
          console.error(`Error while downloading the file: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error while downloading the file: ${error.message}`);
      }
    }
  
    return (
      <ComponentContainer>
        <LabelContainer className={fileStyles.labelContainer}>
          <Label label={label} validations={validations} />
        </LabelContainer>
        <InputsContainer>
          <input
              name={name} 
              className={clsx('col-12', fileStyles.file, errors?.length > 0 && 'p-invalid')} 
              type='file' 
              onChange={onChange}
              multiple={multiple}
              disabled={disabled}
          />
          <Subtitle subtitle={subtitle} />
          <Errors errors={errors} />
          {value?.map((file) => {
            const regex = /filename="([^"]*)"/
            const match = file.contentDisposition.match(regex)
            let fileName = ''
            if (match && match[1]) {
              fileName = match[1]
              return (
                <div className={`${viewStyles.fileDownloadWrapper}`} key={file.guid} onClick={() => downloadFile(file, fileName)}>
                  <i className={`pi pi-file ${viewStyles.fileDownloadIcon}`} />
                  <label className={`${viewStyles.fileDowloadLabel}`}>
                    {fileName}
                  </label>
                </div>
              )
            } else {
              return (
                <></>
              )
            }
          })}
        </InputsContainer>
      </ComponentContainer>
    )
}

export function ViewRichText({ metadata, value, assignValuesNested, errors }) {
    const { name, label, subtitle, disabled } = metadata

    return (
        <ComponentContainer> 
            <LabelContainer className={`${viewStyles.labelContainerRichText} mr-2`}> 
                <Label label={label} />
            </LabelContainer>
            <InputsContainer className={viewStyles.inputsContainerRichText}>
                <LexicalEditor name={name} value={value} onChange={assignValuesNested} readOnly={disabled} /> 
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewReadonlySubtitle({ metadata }) {
    const { subtitle } = metadata 
    return (
      <div className='mb-5 mt-3'>
          <ReadonlyLexicalEditor value={ subtitle } />
      </div>
    )
}

  export function ViewSignature ({metadata, value, onChange, errors, formSubmission }) {
    const { name, label, subtitle, disabled, fontStyle, validations } = metadata
    // const { authorLegalName, authorEmail } = formDefinitionData <-- This throws an error because formDefinitionData is undefined. Will fix later when not in time crunch.
    const router = useRouter()
    const { accounts } = useMsal()
    const account = useAccount(accounts[0] ?? {})

    // metadata.validations = {
    //     signatureName: formDefinitionData.authorDisplayName
    // }

    const onSignatureChange = (e) => {
        const signTime = new Date()
        onChange({target: {name: name, value: {
            signatureGuid: '',
            signTime: `${signTime}`,
            userId: account.localAccountId,
            // fullLegalName: authorLegalName,
            // email: authorEmail,
            securityLevel: 'Email, Account Authentication(None)',
            userIPv4: '',
            signatureAdoption: 'Pre-Selected Style',
            value: e.target.value
        }}})
    }

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputText 
                    className={clsx('col-12', signatureStyles.signature, errors?.length > 0 && 'p-invalid')} 
                    name={name} 
                    value={value?.value} 
                    onChange={(e) => onSignatureChange(e)} 
                    style={{fontFamily: fontStyle}}
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
                {router.pathname.includes('/form-data/') && <DisplaySignatureInfo formSubmission={formSubmission} />}
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewMultiRadioButtons ({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, options, disabled, otherOptions, validations, defaultValue } = metadata
    const [checkedValue, setCheckedValue] = useState(value?.isOther ? value.savedInput : value)
    const [otherOptionInputValue, setOtherOptionInputValue] = useState(value?.isOther ? value.savedInput : '')
    const [otherChecked, setOtherChecked] = useState(value?.isOther ? true : false)

    const handleOtherOption = () => {
        setCheckedValue('PlACEHOLDER')
        setOtherChecked(true)
        setOtherOptionInputValue('')
    }

    const handleOtherOptionInputValueChange = (value, index) => {
        setOtherOptionInputValue(value)

        const eventObject = {
            target: {
                name: name,
                value: {
                    savedInput: value,
                    isOther: true
                }
            }
        }

        onChange(eventObject)
    }

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                {(options.length > 0 || otherOptions.length > 0) &&
                    <>
                        {options.map((radioButton, index) => {
                            return (
                                <div className='mt-1' key={index}>
                                    <RadioButton
                                        value={radioButton.value}
                                        name={name}
                                        onChange={() => {
                                            setCheckedValue(radioButton.value)
                                            setOtherChecked(null)
                                            onChange({target: { name: name, value: radioButton.value } })
                                        }} 
                                        checked={checkedValue ? checkedValue == radioButton.value : defaultValue === radioButton.value} 
                                        style={{marginRight: '0.5rem'}} 
                                        disabled={disabled}
                                    />
                                    <label>{radioButton.value}</label>
                                </div>
                            )
                        })}
                        {otherOptions &&
                            <div className='mt-1' key={options.length + 1}>
                                <RadioButton
                                    value={otherOptionInputValue}
                                    name={name}
                                    onChange={() => handleOtherOption()}
                                    checked={otherChecked}
                                    disabled={disabled}
                                />
                                <label> Other:</label>
                                {otherChecked &&
                                    <InputText className='col-12 mt-2' value={otherOptionInputValue} onChange={(e) => handleOtherOptionInputValueChange(e.target.value)} />
                                }
                            </div>
                        }
                    </>
                }
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewCheckbox({ metadata, value, onChange, errors }) {
    const { name, label, subtitle, disabled, validations, defaultValue } = metadata 
    const defaultValueIds = metadata?.options
        .map((option, index) => {
            if (option.value === defaultValue?.[index]) {
                return index
            }
        })
        .filter(id => id !== undefined)
    const [checkedValues, setCheckedValues] = useState(value?.checkbox || [])
    const [checkedIds, setCheckedIds] = useState(defaultValue ? defaultValueIds : value?.ids || [])

    const onCheckboxChange = (e) => {
        const { checked, value, target: { id } } = e
        console.log('value:', value)
        let selectedCheckbox = [...checkedValues]
        let selectedIds = [...checkedIds]

        if (checked) {
            selectedCheckbox.push(value)
            selectedIds.push({$numberInt: id})
        }
        else {
            selectedCheckbox = selectedCheckbox.filter((checkboxValue) => checkboxValue !== value)
            selectedIds = selectedIds.filter((checkboxId) => checkboxId.$numberInt != id)
        }

        setCheckedValues(selectedCheckbox)
        setCheckedIds(selectedIds)

        return { target: { name, value: { checkbox: selectedCheckbox, ids: selectedIds } } }
    }

    return (
        <ComponentContainer>
            {label && <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>}
            <InputsContainer className={clsx(!label && 'col-12')}>
                {metadata.options.length > 0 &&
                    <>
                        {metadata.options.map((checkboxes, index) => {
                            return (
                                <div className='mb-1' key={index}>
                                    <Checkbox
                                        className='mr-1'
                                        key={index}
                                        id={index}
                                        value={checkboxes.value}
                                        onChange={(e) => onChange(onCheckboxChange(e))}
                                        checked={checkedIds.some(id => id.$numberInt == index)} 
                                        disabled={disabled}
                                    />
                                    <label>{checkboxes.value}</label>
                                </div>
                            )
                        })}
                    </>
                }
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function ViewAddress({ metadata, value, onChange }) {
    const { name, label, subtitle, defaultValue, validations, disabled } = metadata
    const [addressValue, setAddressValue] = useState('')
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(null)
  
    function handleAddressInputChange(e) {
      setAddressValue(e.target.value)
      onChange({target: {name: name, value: e.target.value}})
    }

    function handleSelectSuggestion(e) {
        setSelectedAddress(e.value.addressObj)
    }
  
    async function handleAddressFilter(event) {
      if (!event.query) return
  
      const results = await fetch('/form-builder-studio/api/smarty', {
        method: 'POST',
        body: JSON.stringify({ address: event.query }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
  
      const filteredAddresses = results.result.map(suggestion => {
        const { streetLine, city, state, zipcode } = suggestion
        return {
          fullAddress: `${streetLine} ${city}, ${state} ${zipcode}`,
          addressObj: suggestion
        }
      })
  
      setFilteredSuggestions(filteredAddresses)
    }

    return (
      <ComponentContainer style={{flexDirection: 'column'}}>
          <Label label={label} validations={validations}/>      
            <div className={addressStyles.fieldContainer}>
              <div style={{marginLeft: '4.1rem'}}>
                <div style={{marginBottom: '1rem'}}>
                  <label className={addressStyles.labelAlignment}>Street</label>
                  <AutoComplete field='fullAddress' value={addressValue} suggestions={filteredSuggestions}
                    completeMethod={handleAddressFilter} onChange={(e) => handleAddressInputChange(e)} 
                    onSelect={(e) => handleSelectSuggestion(e)} disabled={disabled}
                  />
                </div>
                <div className={addressStyles.componentAlignment}>
                  <label className={addressStyles.labelAlignment}>City</label>
                  <InputText value={selectedAddress?.city} readOnly disabled={disabled} />
                </div>
              </div>
              <div style={{marginRight: '2.5rem'}}>
                <div className={addressStyles.componentAlignment} style={{marginBottom: '1rem'}}>
                  <label className={addressStyles.labelAlignment}>State</label>
                  <InputText value={selectedAddress?.state} readOnly disabled={disabled} />
                </div>
                <div className={addressStyles.componentAlignment}>
                  <label className={addressStyles.labelAlignment}>Zip</label>
                  <InputText value={selectedAddress?.zipcode} readOnly disabled={disabled} />
                </div>
              </div>
            </div>
            <Subtitle subtitle={subtitle} />
      </ComponentContainer>
  )
}