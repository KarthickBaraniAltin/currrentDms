import { useState } from 'react'

export const usePreventSubmit = ({metadata, inputs}) => {
    const [isDisabled, setIsDisabled] = useState(false)
    const checkErrors = (errors) => {
        for (const property in errors) {
            if (errors[property].length > 0) {
                // If any array in the error object is greater than zero there is an error.
                return true
            }

            for (const guid in metadata) {
                if (property === metadata[guid].name) {
                    if (metadata[guid]?.validations?.required?.isRequired) {
                        if (Object.keys(inputs).some(input => input.includes("checkbox"))) {
                            // Checkbox (multiple choice) components require a more complicated validation.
                            /* 
                                inputs: { checkbox: Array(0), ids: Array(0) }
                            */
                            if (inputs[property]?.checkbox.length === 0) {
                                // If the length of checkbox is zero then that means there is no input in the checkbox.
                                return true
                            }
                        }
                        if (!inputs?.[property] || inputs?.[property].length < 1) {
                            // !inputs?.[property] checks if the input for the required component even exists.
                            // inputs?.[propery].length < 1 checks if the input for the required component is empty.

                            return true
                        }
                    }
                }
            }
        }

        return false
    }

    return { isDisabled, setIsDisabled, checkErrors }
}