import React from 'react'
import {useDraggable} from '@dnd-kit/core'
import {CSS} from '@dnd-kit/utilities'
import Image from 'next/image'
import DraggableStyles from './Draggable.module.css'
import Header from '../../../images/component_images/Header.png'
import dragImage from '../../../images/component_images/Image.png'
import ShortText from '../../../images/component_images/ShortText.png'
import DatePicker from '../../../images/component_images/DatePicker.png'
import LargeText from '../../../images/component_images/LargeText.png'
import RichText from '../../../images/component_images/RichText.png'
import Time from '../../../images/component_images/Time.png'
import Number from '../../../images/component_images/Number.png'
import FileUpload from '../../../images/component_images/FileUpload.png'
import Dropdown from '../../../images/component_images/Dropdown.png'
import Multiselect from '../../../images/component_images/Multiselect.png'
import SingleChoice from '../../../images/component_images/SingleChoice.png'
import MultipleChoice from '../../../images/component_images/MultipleChoice.png'
import Mask from '../../../images/component_images/Mask.png'
import Subtitle from '../../../images/component_images/Subtitle.png'
import Signature from '../../../images/component_images/Signature.png'
import Address from '../../../images/component_images/Address.png'
 
export function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
    data: { // This optional property is how the metadata of the component is transferred to the main form panel.
        ...props
    }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    padding: '0 1rem',
  }

  const imageSize = props.type === "text" || props.type === "textarea" || props.type === "richText" ||
  props.type === "dropdown" || props.type === "multiselect" || props.type === "radiobutton" || props.type === "checkbox"
  ? 16 : 24

  let componentImage

  switch (props.type) {
    case 'header':
      componentImage = Header
      break
    case 'image':
      componentImage = dragImage
      break
    case 'text':
      componentImage = ShortText
      break
    case 'textarea':
      componentImage = LargeText
      break
    case 'richText':
      componentImage = RichText
      break
    case 'calendar':
      componentImage = DatePicker
      break
    case 'time':
      componentImage = Time
      break
    case 'number':
      componentImage = Number
      break
    case 'file':
      componentImage = FileUpload
      break
    case 'dropdown':
      componentImage = Dropdown
      break
    case 'multiselect':
      componentImage = Multiselect
      break
    case 'radiobutton':
      componentImage = SingleChoice
      break
    case 'checkbox':
      componentImage = MultipleChoice
      break
    case 'mask':
      componentImage = Mask
      break
    case 'subtitle':
      componentImage = Subtitle
      break
    case 'signature':
      componentImage = Signature
      break
    case 'address':
      componentImage = Address
      break
    default:
      componentImage = Header
  }

  
  
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} id={props.type === "image" || props.type === "file" ? DraggableStyles.noMarginBottom : null} className={DraggableStyles.draggable}>
      <Image src={componentImage} width={imageSize} height={imageSize} />
      <div>
        {props.children}
      </div>
    </div>
  );
}