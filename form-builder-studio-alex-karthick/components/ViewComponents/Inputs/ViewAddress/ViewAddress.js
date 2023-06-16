import React, { useState } from 'react'
import Label from '../../../SharedComponents/Label/Label'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import ComponentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import { AutoComplete } from 'primereact/autocomplete'
import { InputText } from 'primereact/inputtext'
import addressStyles from './../../../SharedComponents/Address/Address.module.css'

export default function ViewAddress({ metadata, value, onChange }) {
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