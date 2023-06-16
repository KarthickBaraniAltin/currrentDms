import { useState } from 'react'

export const useSignatureInputs = () => {
    const [fontInputs, setFontInputs] = useState([])

    const handleSignatureChange = (event, guid, metadata) => {
        const checkSameSignature = fontInputs.some(obj => obj.guid === guid)
        const sameSignatureIndex = fontInputs.findIndex(obj => obj.guid === guid)

        if (checkSameSignature) {
            let tempFontInputs = JSON.parse(JSON.stringify(fontInputs))
            tempFontInputs[sameSignatureIndex].value = event.target.value
            setFontInputs(tempFontInputs)
        } else {
            setFontInputs([
                ...fontInputs,
                {guid: guid, value: event.target.value}
            ])
        }

        metadata.fontStyle = event.target.value
    }  

    return {fontInputs, setFontInputs, handleSignatureChange}
}