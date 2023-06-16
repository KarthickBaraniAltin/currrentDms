import { useState, useEffect, useCallback, useMemo } from "react"

// This useValidation will get updated and needs to be checked by Alex
// Please look at the comments
export const useValidation = ({ metadata, inputs, files, authorName }) => {
    const [validations, setValidations] = useState({})
    const [errors, setErrors] = useState({})

    const validationMapper = useMemo(() => {
        return {
            isFilled: (value) => {
                if (typeof value === 'undefined') {
                    return true
                }

                if (value === null) {
                    return false
                }

                if (typeof value === 'object') {
                    if (Array.isArray(value) && value.length > 0) {
                        return true
                    }

                    if (!Array.isArray(value) && Object.keys(value).length > 0) {
                        return true
                    }

                    if (value instanceof Date) {
                        return true
                    }
                }

                if (typeof value === 'string' && value.length > 0) {
                    return true
                }

                return false
            },
            stringContains: (mainString, searchString) => {
                return mainString.includes(searchString)
            },
            textLength: (lengthObj, currentLength) => {
                if (lengthObj?.minLength > currentLength) {
                    return 'min'
                }
                if (lengthObj?.maxLength < currentLength) {
                    return 'max'
                }
            },
            intBiggerThan: (value1, value2) => {
                return value1 > value2
            },
            numLength: (numObj, currentNum) => {
                if (numObj?.minNum > currentNum) {
                    return 'min'
                }
                if (numObj?.maxNum < currentNum) {
                    return 'max'
                }
            },
            dateLength: (dateObj, currentDate) => {
                const minDateObj = new Date(dateObj?.minDate)
                const maxDateObj = new Date(dateObj?.maxDate)

                if (minDateObj?.getFullYear() >= currentDate?.getFullYear()) {
                    if (minDateObj?.getMonth() >= currentDate?.getMonth()) {
                        if (minDateObj?.getDate() > currentDate?.getDate()) {
                            return 'min'
                        }
                    }
                }

                if (maxDateObj?.getFullYear() <= currentDate?.getFullYear()) {
                    if (maxDateObj?.getMonth() <= currentDate?.getMonth()) {
                        if (maxDateObj?.getDate() < currentDate?.getDate()) {
                            return 'max'
                        }
                    }
                }
            },
            timeLength: (timeObj, currentTime) => {
                const minTimeObj = new Date(timeObj?.minTime)
                const maxTimeObj = new Date(timeObj?.maxTime)

                if (minTimeObj?.getHours() >= currentTime?.getHours()) {
                    if (minTimeObj?.getMinutes() > currentTime?.getMinutes()) {
                        return 'min'
                    } else if (minTimeObj?.getHours() > currentTime?.getHours()) {
                        return 'min'
                    }
                }

                if (maxTimeObj?.getHours() <= currentTime?.getHours()) {
                    if (maxTimeObj?.getMinutes() < currentTime?.getMinutes()) {
                        return 'max'
                    } else if (maxTimeObj?.getHours() < currentTime.getHours()) {
                        return 'max'
                    }
                }
            },
            // Below two functions can become one function 
            minFile: (minFileSize, files) => {
                if (!minFileSize || !files) return true
    
                for (const file of files) {
                    if (minFileSize > file.size) {
                        return false
                    }
                }
    
                return true
            },
            maxFile: (maxFileSize, files) => {
                if (!maxFileSize || !files) return true

                for (const file of files) {
                    if (maxFileSize < file.size) {
                        return false
                    }
                }
    
                return true
            },
            fileLength: (fileObj, files) => {
                console.log("fileObj:", fileObj)
                for (const file of files) {
                    if (fileObj?.minFileSize > file.size) {
                        return 'min'
                    }
                    if (fileObj?.maxFileSize > file.size) {
                        return 'max'
                    }
                }
            },
            fileType: (validFileTypes, files) => {
                if (!validFileTypes || !files) return true
    
                return validFileTypes.some(validFileType => {
                    return files.some(file => {
                        if (validFileType !== file.type) {
                            return false
                        } else {
                            return true
                        }
                    })
                })
            },
            signatureName: (authorName, userInput) => {
                console.log('userInput:', userInput)
                if (userInput === undefined) return true

                if (authorName !== userInput) {
                    return false
                } else {
                    return true
                }
            }
        }
    }, [])

    const validate = useCallback(() => {
        if (metadata && Object.keys(metadata).length > 0) {
            const errorMessages = {}

            for (const [key, element] of Object.entries(metadata)) {
                const { validations, name, guid } = element
                const inputValue = inputs[name]
                const currentFiles = files?.[name]
                const currentErrors = []

                if (element.name.startsWith("signature")) {
                    // signatureName validation doesn't work without this if statement.
                    // validations.signatureName = true
                }

                if (validations) {
                    for (const [key, value] of Object.entries(validations)) {
                        switch (key) {
                            case 'required': {
                                const { message, isRequired } = value
                                if (!validationMapper.isFilled(inputValue) && isRequired) {
                                    currentErrors.push(message ?? `This field is required`)
                                }
                                break
                            }
                            case 'fileRequired': {
                                const { message, isFileRequired } = value
                                if ((Array.isArray(currentFiles) && currentFiles.length === 0) && isFileRequired) {
                                    currentErrors.push(message ?? `This field is required`)
                                }
                                break
                            }
                            case 'textLength': {
                                const { minMessage, maxMessage } = value
                                if (validationMapper.textLength(value, inputValue?.length) === 'min') {
                                    currentErrors.push(minMessage ?? `This field must have ${value.minLength} characters or more`)
                                }
                                if (validationMapper.textLength(value, inputValue?.length) === 'max') {
                                    currentErrors.push(maxMessage ?? `This field must be ${value?.maxLength} characters or less`)
                                }
                                break
                            }
                            case 'numLength': {
                                const { minMessage, maxMessage } = value
                                if (validationMapper.numLength(value, inputValue) === 'min') {
                                    currentErrors.push(minMessage ?? `This field must be greater than or equal to ${value?.minNum}`)
                                }
                                if (validationMapper.numLength(value, inputValue) === 'max') {
                                    currentErrors.push(maxMessage ?? `This field must be less than or equal to ${value?.maxNum}`)
                                }
                                break
                            }
                            case 'dateLength': {
                                const { minMessage, maxMessage } = value
                                const newMinDate = new Date(value?.minDate)
                                const newMaxDate = new Date(value?.maxDate)
                                if (validationMapper.dateLength(value, inputValue) === 'min') {
                                    currentErrors.push(minMessage ?? `Please pick a date on or 
                                    after ${newMinDate?.getMonth() + 1}/${newMinDate?.getDate()}/${newMinDate?.getFullYear()}`)
                                }
                                if (validationMapper.dateLength(value, inputValue) === 'max') {
                                    currentErrors.push(maxMessage ?? `Please pick a date on or 
                                    before ${newMaxDate?.getMonth() + 1}/${newMaxDate?.getDate()}/${newMaxDate.getFullYear()}`)
                                }
                                break
                            }
                            case 'timeLength': {
                                const { minMessage, maxMessage } = value
                                if (validationMapper.timeLength(value, inputValue) === 'min') {
                                    let newTime = new Date(value?.minTime)
                                    let hours = newTime.getHours()
                                    let isPM = false

                                    if (hours === 12) {
                                        isPM = true
                                    } else if (hours > 12) {
                                        hours -= 12
                                        isPM = true
                                    }
                                    currentErrors.push(minMessage ?? `Please pick a time on or after ${hours}:${newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes()}:${isPM ? 'PM' : 'AM'}`)
                                }
                                if (validationMapper.timeLength(value, inputValue) === 'max') {
                                    let newTime = new Date(value?.maxTime)
                                    let hours = newTime.getHours()
                                    let isPM = false

                                    if (hours === 12) {
                                        isPM = true
                                    } else if (hours > 12) {
                                        hours -= 12
                                        isPM = true
                                    }

                                    currentErrors.push(maxMessage ?? `Please pick a time on or before ${hours}:${newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes()}:${isPM ? 'PM' : 'AM'}`)
                                }
                                break
                            }
                            case 'fileLength': {
                                const {minMessage, maxMessage} = value
                                if (validationMapper.fileLength(value, currentFiles) === 'min') {
                                    currentErrors.push(minMessage ?? `File(s) must be larger than ${value?.minFile}`)
                                }
                                if (validationMapper.fileLength(value, currentFiles) === 'max') {
                                    currentErrors.push(maxMessage ?? `File(s) must be smaller than ${value?.maxFile}`)
                                }
                                break
                            }
                            case 'fileTypes': {
                                const { fileTypes, message } = value
                                if (!validationMapper.fileType(fileTypes, currentFiles)) {
                                    const validFileTypes = fileTypes.map((fileType, index) => {
                                        return <li key={index}>{fileType.split('/')[1]}</li>
                                    })
                                    const finalFileTypeMessage = (
                                        <div>
                                            <p style={{ margin: 0 }}>Accepted file types:</p>
                                            <ul style={{ margin: 0, padding: '0 1rem' }}>{validFileTypes}</ul>
                                        </div>
                                    )
                                    currentErrors.push(message ?? finalFileTypeMessage)
                                }
                                break
                            }
                            case 'signatureName': {
                                if (!validationMapper.signatureName(authorName, inputValue?.value)) {
                                    currentErrors.push('Input must match your full name')
                                }
                                break
                            }
                            default:
                                console.error(`Cant find validation named = ${key}`)
                        }
                    }

                    if (currentErrors) {
                        errorMessages[name] = currentErrors
                    }
                }
            }

            setErrors({...errorMessages})
        }
    }, [metadata, inputs, files, validationMapper])

    useEffect(() => {
        validate()
    }, [metadata, validate])
    
    return { errors, validationMapper }
}