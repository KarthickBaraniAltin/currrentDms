import Head from 'next/head'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useAccount, useMsal, useMsalAuthentication } from "@azure/msal-react"
import { formBuilderApiRequest } from '../../../src/msalConfig'
import { getFormDefinition } from '../../../api/apiCalls'
import { InteractionType } from '@azure/msal-browser'
import { useApi } from '../../../hooks/useApi'
import useTimeControl from '../../../hooks/useTimeControl'
import { useMemo, useRef } from 'react'
import { useInputs } from '../../../hooks/useInput'
import ViewComponents from '../../../components/ViewComponents/ViewComponents/ViewComponents'
import { useValidation } from '../../../hooks/useValidation'
import { usePreventSubmit } from '../../../hooks/usePreventSubmit'
import { useConvertFormSubmission } from '../../../hooks/useConvertFormSubmission'
import { Toast } from 'primereact/toast'
import { useCondition } from '../../../hooks/useCondition'
import useUtilityFunctions from '../../../hooks/useUtilityFunctions'
import { useRouter } from 'next/router'

const api = process.env.NEXT_PUBLIC_FORM_BUILDER_API

export default function View({ id, metadata, initialValues, footer, formDefinitionData }) {

    console.log("Form Definition Data = ", formDefinitionData)
    
    const toast = useRef(null)
    const { convertData } = useConvertFormSubmission()
    const convertedData = convertData(initialValues)
    const { inputs, files, handleInputChange, assignValuesNested } = useInputs({ initialValues: convertedData })
    const { createUserFriendlyId } = useUtilityFunctions()
    const router = useRouter()

    const { isDisabled, setIsDisabled, checkErrors } = usePreventSubmit({metadata, inputs})
    const { errors, validationMapper } = useValidation({ metadata, inputs, files, authorName: formDefinitionData.authorDisplayName })
    const { conditionMapper, conditions } = useCondition({ validationMapper })

    const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)
    const { loading, callApiFetch } = useApi()

    const { startViewTime } = useTimeControl()
    const { accounts } = useMsal()
    const account = useAccount(accounts[0] ?? {})

    const disableSubmitButton = useMemo(() => {
        return checkErrors(errors)
    }, [errors])

    useMemo(() => {
        setIsDisabled(disableSubmitButton)
    }, [disableSubmitButton])

    const submitFormSubmission = async (event) => {
        event.preventDefault()

        if (checkErrors(errors)) {
            return toast.current.show({ severity: 'error', summary: 'Error', detail: 'Check for Errors or Empty Required Fields', life: 2500 })
        }

        const { accessToken } = await acquireToken()
        const formData = new FormData()
        let info = {}
        if (account) {
            const { name, username, localAccountId } = account
            const { id, name: formName } = formDefinitionData

            info = {
                formId: createUserFriendlyId(id, formName),
                userId: localAccountId,
                fullLegalName: name,
                email: username,
            }
        }

        Object.keys(files).forEach((fieldName) => {
            files[fieldName].forEach((file) => {
                formData.append(fieldName, file)
            })
        })

        formData.append("info", JSON.stringify(info))
        formData.append("data", JSON.stringify(inputs))
        const fetchParams = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData
        }

        const res = await callApiFetch(`${api}/FormSubmission/${id}`, fetchParams)
        if (Object.keys(res).length !== 0) {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Form Submitted', life: 2500 })
            setTimeout(() => {
                router.push('/MySubmissions/Submitted')
            }, 1500) 
            return
        }

        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error while updating the form', life: 2500 })
    }

    return (
        <>
            <Head>
                <title>View Form</title>
                <link rel='icon' sizes='32x32' href='/form-builder-studio/logo.png' />
            </Head>
            <AuthenticatedTemplate>
                <Toast ref={toast} />
                <div className='grid'>
                    <Card className='card form-horizontal mt-5' style={{'width': '70%'}}>
                        <ViewComponents 
                            metadata={metadata} 
                            conditions={conditions}
                            conditionMapper={conditionMapper}
                            validationMapper={validationMapper}
                            inputs={inputs} 
                            handleInputChange={handleInputChange} 
                            assignValuesNested={assignValuesNested}
                            errors={errors} 
                            formDefinitionData={formDefinitionData}
                        />
                        <div className='flex justify-content-center mt-5'>
                            <Button className='col-2' label="Submit" onClick={submitFormSubmission} loading={loading} />
                        </div>
                        <div className='flex justify-content-end mt-1'>
                            <label>{footer}</label>
                        </div>
                    </Card>
                </div>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <div className='card form-horizontal mt-3' style={{ 'width': '55rem' }}>
                    <div className='card-body'>
                        <h2 className='text-center text-primary card-title mb-2'>Please Sign In</h2>
                    </div>
                </div>
            </UnauthenticatedTemplate>
        </>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        const res = await getFormDefinition(id)

        const initialValues = {}
        if (res.data?.metadata?.metadata) {
            const metadata = res.data.metadata.metadata;
            Object.keys(metadata).forEach((key) => {
                const element = metadata[key];
                if (element.defaultValue) {
                    initialValues[element.name] = element.defaultValue;
                }
            });
        }

        return {
            props: {
                id,
                metadata: res.data.metadata.metadata,
                footer: res.data.footer,
                initialValues,
                formDefinitionData: res.data
            }
        }
    } catch (err) {
        console.error(err)
        return {
            props: {
                data: []
            }
        }
    }
}