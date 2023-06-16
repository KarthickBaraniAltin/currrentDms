import axios from 'axios'
import https from 'https'

const formBuilderStudioApi = process.env.NEXT_PUBLIC_FORM_BUILDER_API

axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

export const postFormDefinition = (formDefinition) => {
    return axios.post(`${formBuilderStudioApi}/FormDefinition`, formDefinition)
}

export const putFormDefinition = (formDefinition, id) => {
    return axios.put(`${formBuilderStudioApi}/FormDefinition/${id}`, formDefinition)
}

export const getFormDefinition = (id) => {
    return axios.get(`${formBuilderStudioApi}/FormDefinition/${id}`)
}

export const getFormDefinitions = (query) => {
    return axios.get(`${formBuilderStudioApi}/FormDefinition/Filter${query}`)
}

export const postFormSubmission = (formDefinitionId, FormSubmission) => {
    return axios.post(`${formBuilderStudioApi}/FormSubmission/${formDefinitionId}`, FormSubmission, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getFormSubmissions = () => {
    return axios.get(`${formBuilderStudioApi}/FormSubmission`)
}

export const getFormSubmission = (id) => {
    return axios.get(`${formBuilderStudioApi}/FormSubmission/${id}`)
}

export const getFormSubmissionsFiltered = (formDefinitionId, query) => {
    return axios.get(`${formBuilderStudioApi}/FormSubmission/formDefinition/${formDefinitionId}/filter${query}`)
}

export const getAllFormSubmissionsFiltered = (query) => {
    return axios.get(`${formBuilderStudioApi}/FormSubmission/filter/${query}`)
}