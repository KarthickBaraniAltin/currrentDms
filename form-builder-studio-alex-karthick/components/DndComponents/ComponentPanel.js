import { Card } from 'primereact/card'
import { Draggable } from './Draggable'

export const fullSizeClassName = 'col-11 mlr-05'
export const halfSizeClassName = 'col-5 mlr-05'

export default function ComponentPanel() {

    const componentTypes = [
        'header',
        'text',
        'calendar',
        'time',
        'number',
        'textarea',
        'mask',
        'dropdown',
        'multiselect',
        'file',
        'image',
        'richText',
        'subtitle',
        'signature',
        'radiobutton',
        'checkbox'
    ]

    const defaultSubtitle = JSON.stringify({"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}})
                                           
    const draggableItems = componentTypes.map((component, index) => {
        if (component === 'header') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    guid=''
                    divClassName={fullSizeClassName}
                    label={defaultSubtitle}
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Header
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'text') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Text'
                    subtitle={defaultSubtitle}
                    defaultValue=''
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Short Text
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'calendar') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Calendar'
                    subtitle={defaultSubtitle}
                    defaultValue=''
                    dateFormat='dd-mm-yy'
                    minDate=''
                    maxDate=''
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Date Picker
                        </label> 
                    </div> 
                </Draggable>
            )
        }

        if (component === 'time') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    label='Time'
                    subtitle={defaultSubtitle}
                    divClassName={halfSizeClassName}
                    defaultValue=''
                    showTime
                    timeOnly
                    hourFormat='12'
                    minDate=''
                    maxDate=''
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Time
                        </label> 
                    </div> 
                </Draggable>
            )
        }

        if (component === 'number') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Number'
                    subtitle={defaultSubtitle}
                    defaultValue=''
                    format={false}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Number
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'textarea') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={fullSizeClassName}
                    label='Textarea'
                    subtitle={defaultSubtitle}
                    defaultValue=''
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Large Text
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'mask') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Mask'
                    subtitle={defaultSubtitle}
                    defaultValue=''
                    mask='(999) 999-9999'
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Mask
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'dropdown') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Dropdown'
                    subtitle={defaultSubtitle}
                    defaultValue=''
                    options={[]}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Dropdown
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'multiselect') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Multiselect'
                    subtitle={defaultSubtitle}
                    defaultValue=''
                    options={[]}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Multiselect Dropdown
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'file') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='File'
                    subtitle={defaultSubtitle}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            File Upload
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'image') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={fullSizeClassName}
                    label='Image'
                    subtitle={defaultSubtitle}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Image
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'richText') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={fullSizeClassName}
                    label='Rich Text'
                    subtitle={defaultSubtitle}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Rich Text
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'subtitle') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={fullSizeClassName}
                    subtitle={defaultSubtitle}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Paragraph
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'signature') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Signature'
                    subtitle={defaultSubtitle}
                    fontStyle=''
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Signature
                        </label> 
                    </div>
                </Draggable>
            )
        }

        if (component === 'radiobutton') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    divClassName={halfSizeClassName}
                    label='Radio Buttons'
                    subtitle={defaultSubtitle}
                    options={[]}
                    otherOptions={false}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Single Choice
                        </label>
                    </div>
                </Draggable>
            )
        }

        if (component === 'checkbox') {
            return (
                <Draggable
                    key={index}
                    id={`${index + 1}`}
                    type={component}
                    name={component}
                    label='Checkbox'
                    subtitle={defaultSubtitle}
                    divClassName={halfSizeClassName}
                    options={[]}
                    guid=''
                >
                    <div className='flex justify-content-center'>
                        <label className='block' style={{fontWeight: '700', color: '#000000'}}>
                            Multiple Choice
                        </label>
                    </div>
                </Draggable>
            )
        }
    })

    return (
        <Card className='card ml-3 mt-5' style={{'width': '30%'}}>
            <Card style={{'background': '#004990', 'color': 'white', marginBottom: '0.5rem'}}>
                <h1 style={{textAlign: 'center'}}>Components</h1>
            </Card>
            {draggableItems}
        </Card>
    )
}