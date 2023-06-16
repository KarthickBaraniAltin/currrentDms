import React, { createElement, useState, useEffect } from 'react'
import { Sortable } from '../../DndComponents/Sortable/Sortable'
import { Resizable } from 're-resizable'
import NextImage from 'next/image'
import clsx from 'clsx'
import 'react-resizable/css/styles.css'
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
import Errors from '../../SharedComponents/Errors/Errors'
import Label from '../../SharedComponents/Label/Label'
import Subtitle from '../../SharedComponents/Subtitle/Subtitle'
import SettingsButton from '../SettingsButton/SettingsButton'
import LabelContainer from '../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../SharedComponents/InputsContainer/InputsContainer'
import ComponentContainer from '../../SharedComponents/ComponentContainer/ComponentContainer'
import LexicalEditor from '../../LexicalEditor/LexicalEditor'
import ReadonlyLexicalEditor from '../../LexicalEditor/ReadonlyLexicalEditor/ReadonlyLexicalEditor'
import styles from '../../../styles/Inputs/Inputs.module.css'
import calendarStyles from '../../SharedComponents/Calendar/Calendar.module.css'
import numberStyles from '../../SharedComponents/Number/Number.module.css'
import textareaStyles from '../../SharedComponents/Textarea/Textarea.module.css'
import maskStyles from '../../SharedComponents/Mask/Mask.module.css'
import dropdownStyles from '../../SharedComponents/Dropdown/Dropdown.module.css'
import fileStyles from '../../SharedComponents/File/File.module.css'
import signatureStyles from '../../SharedComponents/Signature/Signature.module.css'
import addressStyles from '../../SharedComponents/Address/Address.module.css'
import headerAndImageStyles from '../../SharedComponents/HeaderAndImage/HeaderAndImage.module.css'

export default function CreateComponents ({ metadata, assignValuesNested, openDialog, inputs, setMetadata, handleInputChange, errors, setFiles, setInputs, authorName }) {
    const objectKeysArray = Object.keys(metadata)

    const componentMapper = {
        'text': CreateText,
        'calendar': CreateCalendar,
        'number': CreateNumber,
        'textarea': CreateTextarea,
        'mask': CreateMask,
        'dropdown': CreateDropdown,
        'time': CreateTime,
        'multiselect': CreateMultiSelect,
        'header': CreateHeader,
        'image': CreateImage,
        'file': CreateFileInput,
        'richText': CreateRichTextInput,
        'subtitle': CreateReadonlySubtitle,
        'signature': CreateSignature,
        'radiobutton': CreateMultiRadioButtons,
        'checkbox': CreateCheckbox,
        'address': CreateAddress
    }

    return (
        <>
            {objectKeysArray?.length === 0 && <h5 style={{ margin: '0 auto' }}>Drop field here</h5>}
            {objectKeysArray?.map(guid => {
                const { type, name, divClassName } = metadata[guid]
                return (
                    <div className={clsx(divClassName, 'mt-4')} key={guid}>
                        <Sortable key={guid} id={guid}>
                                {createElement(componentMapper[type],
                                    {
                                        guid: guid,
                                        setMetadata: setMetadata,
                                        metadata: metadata[guid],
                                        openDialog: openDialog,
                                        value: inputs[name],
                                        onChange: handleInputChange,
                                        assignValuesNested: assignValuesNested,
                                        errors: errors[name],
                                        setFiles: setFiles,
                                        setInputs: setInputs,
                                        authorName: authorName,
                                    }
                                )}
                        </Sortable>
                    </div>
                )
            })}
        </>
    )
}

export function CreateText({ metadata, value, onChange, openDialog, errors, setMetadata }) {
    const { name, label, subtitle, defaultValue, validations } = metadata
    return (
      <ComponentContainer>
        <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
        <LabelContainer>
          <Label label={label} validations={validations} />
        </LabelContainer>
        <InputsContainer>
          <InputText
            name={name}
            className={clsx('col-12', styles.input, errors?.length > 0 && 'p-invalid')}
            autoComplete='off'
            value={value ?? defaultValue}
            onChange={onChange}
          />
          <Subtitle subtitle={subtitle} />
          <Errors errors={errors} />
        </InputsContainer>
      </ComponentContainer>
    )
}

export function CreateCalendar({metadata, value, onChange, openDialog, errors, setMetadata }) {
    const { name, label, subtitle, defaultValue, validations } = metadata
    const convertDataFormat = defaultValue ? new Date(defaultValue) : null
  
    return (
      <ComponentContainer>
        <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
        <LabelContainer>
          <Label label={label} validations={validations} />
        </LabelContainer>
        <InputsContainer>
          <Calendar
            name={name}
            className={clsx('col-12', calendarStyles.calendar, errors?.length > 0 && 'p-invalid')}
            value={value ?? convertDataFormat}
            onChange={onChange}
          />
          <Subtitle subtitle={subtitle} />
          <Errors errors={errors} />
        </InputsContainer>
      </ComponentContainer>
    )
}

export function CreateNumber({ metadata, value, onChange, openDialog, errors, setMetadata }) {
    const { name, validations, label, subtitle, defaultValue, guid, id, page } = metadata

    return (
        <ComponentContainer>
            <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputNumber
                    name={name}
                    className={clsx('col-12', numberStyles.number, errors?.length > 0 && 'p-invalid')}
                    value={value ?? defaultValue}
                    onChange={onChange}
                    useGrouping={false}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
            </InputsContainer>
        </ComponentContainer>
    )
}

export function CreateTextarea({ metadata, value, onChange, openDialog, errors, setMetadata }) {
  const { name, validations, label, subtitle, defaultValue } = metadata

  return (
    <ComponentContainer>
      <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
      <LabelContainer className={`${textareaStyles.textareaLabel} ${textareaStyles.labelWidthContainer}`}>
        <Label label={label} validations={validations} />
      </LabelContainer>
      <InputsContainer className={textareaStyles.inputsContainer}>
        <InputTextarea
          className={clsx('col-12', textareaStyles.textareaInput, errors?.length > 0 && 'p-invalid')}
          name={name}
          autoResize
          value={value ?? defaultValue}
          onChange={onChange}
        />
        <Subtitle subtitle={subtitle} />
        <Errors errors={errors} />
      </InputsContainer>
    </ComponentContainer>
  )
}

export function CreateMask({ metadata, value, onChange, openDialog, errors, setMetadata }) {
  const { name, label, subtitle, mask, validations } = metadata

  return (
      <ComponentContainer>
          <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
          <LabelContainer>
              <Label label={label} validations={validations} />
          </LabelContainer>
          <InputsContainer>
              <InputMask
                  name={name}
                  className={clsx('col-12', maskStyles.mask, errors?.length > 0 && 'p-invalid')}
                  value={value}
                  onChange={onChange}
                  mask={mask}
                  autoClear={false}
              />
              <Subtitle subtitle={subtitle} />
              <Errors errors={errors} />
          </InputsContainer>
      </ComponentContainer>
  )
}

export function CreateDropdown({ metadata, openDialog, value, onChange, errors, setMetadata }) {
  const { name, validations, label, subtitle, options, defaultValue } = metadata

  return (
      <ComponentContainer>
          <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
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
              />
              <Subtitle subtitle={subtitle} />
              <Errors errors={errors} />
          </InputsContainer>
      </ComponentContainer>
  )
}

export function CreateTime({ metadata, value, onChange, openDialog, errors, setMetadata }) {
  const { name, label, subtitle, defaultValue, validations } = metadata
  const convertDataFormat = defaultValue ? new Date(defaultValue) : null

  return (
    <ComponentContainer>
      <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
      <LabelContainer>
        <Label label={label} validations={validations} />
      </LabelContainer>
      <InputsContainer>
        <Calendar
          name={name}
          className={clsx('col-12', calendarStyles.calendar, errors?.length > 0 && 'p-invalid')}
          timeOnly
          showTime
          hourFormat='12'
          value={value ?? convertDataFormat}
          onChange={onChange}
        />
        <Subtitle subtitle={subtitle} />
        <Errors errors={errors} />
      </InputsContainer>
    </ComponentContainer>
  )
}

export function CreateMultiSelect({ metadata, openDialog, value, onChange, errors, setMetadata }) {
  const { name, validations, label, subtitle, options, defaultValue } = metadata

  return (
    <ComponentContainer>
        <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
        <LabelContainer>
          <Label label={label} validations={validations} />
        </LabelContainer>
        <InputsContainer>
          <MultiSelect 
            name={name} 
            className={`col-12 ${dropdownStyles.dropdown}`} 
            value={value ?? defaultValue} 
            onChange={onChange} 
            options={options} 
            display='chip' 
          />        
          <Subtitle subtitle={subtitle} />
          <Errors errors={errors} />
        </InputsContainer>
    </ComponentContainer>
  )
}

export function CreateHeader({ metadata, openDialog, assignValuesNested, guid, value, setFiles, setInputs, setMetadata }) {
  const { name, label, width, height, aspectRatio, file } = metadata

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
    <div className='field grid grid-nogutter'>
        <SettingsButton openDialog={openDialog} componentData={metadata} />
        <input className='col-12 mt-1 mb-2' name={guid} type='file' accept="image/jpeg,image/png"  multiple={false} onChange={handleImageUpload} />                
        {value && 
        <div className='col-4'>  
            <Resizable 
                size={{width, height}}
                onResizeStop={handleResize}                      
                lockAspectRatio={true}   
                maxWidth={'100%'}
                minWidth={40}
                // maxHeight={90}
                enable={{
                    right: true,
                }}
                defaultSize={{
                    width: '100%',
                    height: '100%'
                }}
            >

                <div className={headerAndImageStyles.imageWrapper}>
                    <NextImage src={value ?? image} alt="Uploaded" fill />                    
                </div>
            </Resizable>
          </div>
          } 
          <div className='col-8'>
              <ReadonlyLexicalEditor value={label} />
          </div>
          {/* <h1 className={clsx(value ? 'col-7' : 'col-12',  styles.label, 'mr-1')} >{label}</h1> */}
    </div>
  )
}

export function CreateImage({ metadata, assignValuesNested, setMetadata, guid, value, openDialog, errors, setFiles, setInputs }) {
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
      <ComponentContainer>
          <SettingsButton openDialog={openDialog} componentData={metadata} />
          <LabelContainer className={`${headerAndImageStyles.labelContainer} mr-2`}>
              <Label label={label} />
              <input name={guid} type='file' accept="image/jpeg,image/png"  multiple={false} onChange={handleImageUpload} />                
          </LabelContainer>
          <InputsContainer className={headerAndImageStyles.inputsContainer}>
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
                          <div className={clsx(headerAndImageStyles.imageWrapper, headerAndImageStyles.rightBorder)}>
                              <NextImage src={value ?? image} alt="Uploaded" fill />                    
                          </div>
                      }
                  </Resizable>
              }
              <Subtitle subtitle={subtitle} />
          </InputsContainer>
      </ComponentContainer>
  )
}

export function CreateFileInput({ metadata, openDialog, onChange, errors, setMetadata }) {
  const { name, label, multiple, subtitle, validations } = metadata

  return (
      <ComponentContainer>
          <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
          <LabelContainer className={fileStyles.labelContainer}>
              <Label label={label} validations={validations} />
          </LabelContainer>
          <InputsContainer>
              <input
                  name={name}
                  type='file'
                  className={clsx('col-12', fileStyles.file, errors?.length > 0 && 'p-invalid')}
                  disabled
                  multiple={multiple}
                  onChange={onChange}
              />
              <Subtitle subtitle={subtitle} />
              <Errors errors={errors} />
          </InputsContainer>
      </ComponentContainer>
  )
}

export function CreateRichTextInput({ metadata, openDialog, value, onChange, errors, setMetadata }) {
  const { name, label, subtitle } = metadata

  return (
      <ComponentContainer>
          <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
          <LabelContainer className={`${styles.labelContainer} mr-2`}>
              <Label label={label} />
          </LabelContainer>
          <InputsContainer className={styles.inputsContainer}>
              <LexicalEditor name={name} value={value} onChange={onChange} readOnly={false} />
              <Subtitle subtitle={subtitle} />
              <Errors errors={errors} />
          </InputsContainer>
      </ComponentContainer>
  )
}

export function CreateReadonlySubtitle({ metadata, openDialog, setMetadata }) {
  const { subtitle } = metadata

  return (
      <div>
          <SettingsButton componentData={metadata} openDialog={openDialog} setMetadata={setMetadata} />
          <ReadonlyLexicalEditor value={subtitle} />
      </div>
  )
}

export function CreateSignature({ metadata, openDialog, value, onChange, errors, setMetadata }) {
  const { name, label, subtitle, validations, fontStyle } = metadata

  return (
      <ComponentContainer>
          <SettingsButton componentData={metadata} openDialog={openDialog} setMetadata={setMetadata} />
          <LabelContainer>
              <Label label={label} validations={validations} />
          </LabelContainer>
          <InputsContainer>
              <InputText
                  className={clsx('col-12', signatureStyles.signature, errors?.length > 0 && 'p-invalid')}
                  name={name}
                  value={value}
                  onChange={onChange}
                  style={{ fontFamily: fontStyle }}
              />
              <Subtitle subtitle={subtitle} />
              <Errors errors={errors} />
          </InputsContainer>
      </ComponentContainer>
  )
}

export function CreateMultiRadioButtons({ metadata, openDialog, value, onChange, errors, setMetadata }) {
  const { name, label, subtitle, options, otherOptions, validations, defaultValue } = metadata

  const [checkedValue, setCheckedValue] = useState()
  const [otherChecked, setOtherChecked] = useState()
  const [otherOptionInputValue, setOtherOptionInputValue] = useState('')

  const handleOtherOption = () => {
      setCheckedValue('PlACEHOLDER')
      setOtherChecked(true)
      setOtherOptionInputValue('')
  }

  const handleOtherOptionInputValueChange = (value) => {
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
          <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
          <LabelContainer>
              <Label label={label} validations={validations} />
          </LabelContainer>
          <InputsContainer>
              {options.length > 0 || otherOptions.length > 0 ?
                  <>
                      {options.map((radioButton, index) => {
                          return (
                              <div className='mt-1' key={index}>
                                  <RadioButton
                                      value={radioButton.value}
                                      name={name}
                                      onChange={(e) => {
                                          setCheckedValue(radioButton.value)
                                          setOtherChecked(null)
                                          onChange(e)
                                      }}
                                      checked={checkedValue ? checkedValue === radioButton.value : defaultValue === radioButton.value}
                                      style={{ marginRight: '0.5rem' }}
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
                              />
                              <label> Other:</label>
                              {otherChecked &&
                                  <InputText className='col-12 mt-2' value={otherOptionInputValue} onChange={(e) => handleOtherOptionInputValueChange(e.target.value)} />
                              }
                          </div>
                      }
                  </>
                  : <p>{'Click dialog to add radiobuttons'}</p>
              }
              <Subtitle subtitle={subtitle} />
              <Errors errors={errors} />
          </InputsContainer>
      </ComponentContainer>
  )
}

export function CreateCheckbox({ metadata, onChange, openDialog, errors, setMetadata }) {
  const { name, label, subtitle, validations, defaultValue } = metadata 
  const defaultValueIds = metadata?.options
      .map((option, index) => {
          if (option.value === defaultValue?.[index]) {
              return index
          }
      })
      .filter(id => id !== undefined)
  const [checkedValues, setCheckedValues] = useState(metadata?.options)
  const [checkedIds, setCheckedIds] = useState([])
  const [eventObject, setEventObject] = useState({ target: { name: name, value: [] } })

  useEffect(() => {
      setCheckedIds(defaultValueIds)
  }, [defaultValue])

  const onCheckboxChange = (e) => {
      let selectedCheckbox = [...checkedValues]
      let selectedId = [...checkedIds]

      if (e.checked) {
          selectedCheckbox.push(e.value)
          selectedId.push(e.target.id)
      }
      else {
          selectedCheckbox.splice(selectedCheckbox.indexOf(e.value), 1)
          selectedId.splice(selectedId.indexOf(e.target.id), 1)
      }

      setCheckedValues(selectedCheckbox)
      setCheckedIds(selectedId)

      setEventObject(prevState => {
          let tempState = JSON.parse(JSON.stringify(prevState))
          tempState.target.value = selectedCheckbox
          return tempState
      })

      return { ...eventObject, target: { ...eventObject.target, value: selectedCheckbox } }
  }

  return (
      <ComponentContainer>
          <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
          <LabelContainer>
              <Label label={label} validations={validations} />
          </LabelContainer>
          <InputsContainer>
              {metadata.options.length > 0 ?
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
                                      checked={checkedIds.some(id => id === index)}
                                  />
                                  <label>{checkboxes.value}</label>
                              </div>
                          )
                      })}
                  </>
                  : <p>{'Click dialog to add checkboxes'}</p>
              }
              <Subtitle subtitle={subtitle} />
              <Errors errors={errors} />
          </InputsContainer>
      </ComponentContainer >
  )
}

export function CreateAddress({metadata, value, onChange, openDialog, setMetadata}) {  
  const { name, label, subtitle, defaultValue, validations } = metadata
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

    try {
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
    } catch (error) {
      console.error(error)
      setFilteredSuggestions([])
    }
  }

  return (
    <ComponentContainer style={{flexDirection: 'column'}}>
      <SettingsButton openDialog={openDialog} componentData={metadata} setMetadata={setMetadata} />
      <Label label={label} validations={validations} />      
      <div className={addressStyles.fieldContainer}>
        <div style={{marginLeft: '4.1rem'}}>
          <div style={{marginBottom: '1rem'}}>
            <label className={addressStyles.labelAlignment}>Street</label>
            <AutoComplete field='fullAddress' value={addressValue} suggestions={filteredSuggestions}
            completeMethod={handleAddressFilter} onChange={(e) => handleAddressInputChange(e)} 
            onSelect={(e) => handleSelectSuggestion(e)}
            />
          </div>
          <div className={addressStyles.componentAlignment}>
            <label className={addressStyles.labelAlignment}>City</label>
            <InputText value={selectedAddress?.city} readOnly />
          </div>
        </div>
        <div style={{marginRight: '2.5rem'}}>
          <div className={addressStyles.componentAlignment} style={{marginBottom: '1rem'}}>
            <label className={addressStyles.labelAlignment}>State</label>
            <InputText value={selectedAddress?.state} readOnly />
          </div>
          <div className={addressStyles.componentAlignment}>
            <label className={addressStyles.labelAlignment}>Zip</label>
            <InputText value={selectedAddress?.zipcode} readOnly />
          </div>
        </div>
      </div>
      <Subtitle subtitle={subtitle} />
    </ComponentContainer>
  )
}