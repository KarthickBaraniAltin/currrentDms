import { Dropdown } from 'primereact/dropdown'
import React from 'react'

export default function ColumnSizeDropdowm({name, columnSizeOptions, inputs, onChange}) {

  const columnSizes = columnSizeOptions ?? [
    {label: 'Full Size', value: 'col-11 mlr-05'},
    {label: 'Half Size', value: 'col-5 mlr-05'}
  ]

  return (
      <>
          <label style={{color: '#003459'}}>Change Column Width</label>
          <Dropdown name={name} value={inputs?.[name] ?? ''} style={{width: '100%'}} options={columnSizes} onChange={onChange} placeholder='Select a column size' />
      </>
  )
}
