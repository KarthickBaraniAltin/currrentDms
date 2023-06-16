import React from 'react'
import ReadonlyLexicalEditor from '../../../LexicalEditor/ReadonlyLexicalEditor/ReadonlyLexicalEditor'

export default function ViewReadonlySubtitle({ metadata }) {
  const { subtitle } = metadata 
  return (
    <div className='mb-5 mt-3'>
        <ReadonlyLexicalEditor value={ subtitle } />
    </div>
  )
}