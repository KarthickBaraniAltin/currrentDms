import React from 'react'
import ReadonlyLexicalEditor from '../../LexicalEditor/ReadonlyLexicalEditor/ReadonlyLexicalEditor'

export default function Subtitle({subtitle}) {
  return (
    <>
      {subtitle != `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}` 
        &&
        <ReadonlyLexicalEditor value={subtitle} />  
      }
    </>
  )
}
