import { useState } from "react"

export const useInputs = ({ initialValues = {} }) => {
    const [inputs, setInputs] = useState(initialValues)
    const [files, setFiles] = useState({})

    const handleInputChange = (event) => {
        if (event.target?.files) {
            setFiles({...files, [event.target.name]: Array.from(event.target.files)})
        } else if (event.target) {
            const { name, value } = event.target
            assignValuesNested(name, value)
        } else if (event.originalEvent) {
            const { name, value } = event.originalEvent.target
            assignValuesNested(name, value)
        } else if (typeof event === 'string') {
            
        } else {
            console.error("Error: can't find event target")
        }
    }

    // We can give values nested objects will be created and assigned accordingly
    const assignValuesNested = (path, value) => {
        if (!path) {
            return
        }

        const pathArr = path.split('.')
        const lastKeyIndex = pathArr.length - 1
        let updatedInputs = {...inputs}
        let tmp = updatedInputs
        for (let i = 0; i < lastKeyIndex; ++i) {
            var key = pathArr[i]
            if (!(key in tmp)) {
                tmp[key] = {}
            }
            tmp = tmp[key]
        }
        tmp[pathArr[lastKeyIndex]] = value
        setInputs({...updatedInputs})
    }

    const deleteField = (name) => {
        if (!name) {
            return
        }
    
        const pathArr = name.split('.')
        const lastKeyIndex = pathArr.length - 1
        let updatedInputs = { ...inputs }
        let tmp = updatedInputs
        for (let i = 0; i < lastKeyIndex; ++i) {
            const key = pathArr[i]
            if (!(key in tmp)) {
                return; // The specified field does not exist, no need to continue
            }
            tmp = tmp[key]
        }
    
        if (pathArr[lastKeyIndex] in tmp) {
            delete tmp[pathArr[lastKeyIndex]]
            setInputs({ ...updatedInputs })
        }
    }

    return { inputs, files, setInputs, handleInputChange, assignValuesNested, deleteField }
}