import { useState } from "react";
import axios from "axios";

export const useApi = () => {
    const [response, setResponse] = useState(undefined)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const callApi = async (params) => {
        if (loading) {
            return
        }

        try {
            setLoading(true)
            const result = await axios.request(params)
            const { data } = result

            if (data.statusCode == 400) {
                if (data.value.errors) {
                    assignValidationErrors(data.value.errors)
                }
            } else {
                setValidationErrors({})
                setResponse(result.data)
                return result
            }
        } catch (error) {
            setResponse({})
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const callApiFetch = async (url, fetchParams) => {
        if (loading) {
            return
        }

        try {
            setLoading(true)
            const response = await fetch(url, fetchParams)
            const json = await response.json()

            if (response.status == 400) {
                // set validation errors
                if (json.value.errors) {
                    assignValidationErrors(json.value.errors)
                }
            } else {
                setValidationErrors({})
                setResponse(json)
                return json
            }
        } catch (error) {
            setResponse({})
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const assignValidationErrors = (responseErrors) => {
        const errors = []
        responseErrors.forEach(element => {
            errors[element.propertyName] = [element.errorMessage]
        })
        setValidationErrors(errors)
    }

    return { response, error, loading, validationErrors, callApi, callApiFetch, setLoading }
}
