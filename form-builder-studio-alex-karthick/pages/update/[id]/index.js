
import { useEffect, useState, useRef } from 'react'
import { Card } from 'primereact/card'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsalAuthentication, useMsal, useAccount } from "@azure/msal-react"
import { formBuilderApiRequest } from '../../../src/msalConfig'
import { getFormDefinition } from '../../../api/apiCalls'
import { InteractionType } from '@azure/msal-browser'
import { useApi } from '../../../hooks/useApi'
import { useInputs } from '../../../hooks/useInput'
import { useValidation } from '../../../hooks/useValidation'
import useDialogs from '../../../hooks/useDialogs'
import useDnd from '../../../hooks/useDnd'
import ComponentPanel from '../../../components/DndComponents/ComponentPanel/ComponentPanel'
import PreviewButton from '../../../components/Settings/PreviewButton/PreviewButton'
import { DndContext } from '@dnd-kit/core'
import ShareButton from '../../../components/Settings/ShareButton/ShareButton'
import SaveForm from '../../../components/Settings/SaveForm/SaveForm'
import StatusButton from '../../../components/Settings/StatusButton/StatusButton'
import CreateComponents from '../../../components/CreationComponents/CreateComponents/CreateComponents'
import { Droppable } from '../../../components/DndComponents/Droppable'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Toast } from 'primereact/toast'
import { useCondition } from '../../../hooks/useCondition'
import SettingsStyles from '../../../components/Settings/SettingsContainer/SettingsContainer.module.css'
import useRoles from '../../../hooks/useRoles'
import { Button } from 'primereact/button'
import { Menubar } from 'primereact/menubar'
import Workflow from '../../workflow'
import Feed from '../../../images/component_images/Feed.png'
import LeftDownArrow from '../../../images/component_images/LeftDownArrow.png'
import Avatar from '../../../images/avatar.webp'
import Image from 'next/image'
import NavbarStyles from './update.module.css'
import { useRouter } from 'next/router'
import useUtilityFunctions from '../../../hooks/useUtilityFunctions'
import Head from 'next/head'

const api = process.env.NEXT_PUBLIC_FORM_BUILDER_API

export default function Update({ id, data }) {
    const roles = useRoles()
    const toast = useRef(null)
    const router = useRouter()
    const [formDefinition, setFormDefinition] = useState(data)
    const [metadata, setMetadata] = useState(data?.metadata?.metadata ?? {})
    const [mainFormIds, setMainFormIds] = useState([])
    const [files, setFiles] = useState({})
    const [pageNumber, setPageNumber] = useState(1)
    const [currentPage, setCurrentPage] = useState(pageNumber)

    // const [currentMetadata, setCurrentMetadata] = useState()

    const { handleInputChange, assignValuesNested, setInputs, deleteField, inputs } = useInputs({ initialValues: {} })
    const { errors, validationMapper } = useValidation({ metadata, inputs, authorName: '' })
    const { conditionMapper, conditions, setConditions, addCondition, deleteCondition } = useCondition({ validationMapper })
    const { renderDialog, openDialog } = useDialogs({ metadata, setMetadata, deleteField }) // currentMetadata, setCurrentMetadata, inputs, setInputs, handleInputChange, assignValuesNested
    const { handleDragEnd } = useDnd()
    const { createUserFriendlyDate } = useUtilityFunctions()

    const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)
    const { loading, callApiFetch } = useApi()
    const { accounts, instance } = useMsal()
    const account = useAccount(accounts[0] ?? {})

    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const [signout, setSignout] = useState(false)

    useEffect(() => {
        setMainFormIds(Object.keys(metadata).map(data => data))
    }, [metadata])

    const addMetadata = (data) => {
        setMetadata((prevObj) => ({ ...prevObj, [data.guid]: data }))
        // setCurrentMetadata((prevObj) => ({ ...prevObj, [data.guid]: data }))
    }

    const updateForm = async (event) => {
        event.preventDefault()
        const { accessToken } = await acquireToken()
        const formData = new FormData()

        let info = {
            name: formDefinition.name,
            description: formDefinition.description,
            footer: formDefinition.footer,
            authorDisplayName: '',
            authorLegalName: '',
            authorId: '',
            authorEmail: '',
            status: formDefinition.status
        }

        if (account) {
            const { name, username, localAccountId } = account

            info = {
                ...info,
                authorDisplayName: name,
                authorLegalName: name,
                authorId: localAccountId,
                authorEmail: username,
            }
        }

        formData.append("info", JSON.stringify(info))
        formData.append("metadata", JSON.stringify(metadata))

        Object.keys(files).forEach((fieldName) => {
            formData.append(fieldName, files[fieldName])
        })

        const fetchParams = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData
        }

        const res = await callApiFetch(`${api}/FormDefinition/${id}`, fetchParams)
        if (Object.keys(res).length !== 0) {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Form Updated', life: 2500 })
            setFormDefinition(res)
            return true
        }

        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error while updating the form', life: 2500 })
        return false
    }

    const FormHeader = () => {
        const logoContainerStyle = { color: 'white', display: 'flex', gap: '13.5rem' }

        const logoContainer = (
            <div style={logoContainerStyle}>
                <div style={{ padding: '1.5rem', color: '#003549', fontSize: '32px' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', height: '50px' }}>
                        <Image src={Feed} width={36} height={36} style={{ alignSelf: 'center' }} />
                        AcadDocs
                        <Image src={LeftDownArrow} width={36} height={36} style={{ cursor: 'pointer', marginTop: '0.2rem' }} onClick={() => router.back()} />
                    </div>
                </div>
                <div style={{ alignSelf: 'center' }}>
                    <ul style={{ display: 'flex', textDecoration: 'none', color: '#003459', gap: '4rem', fontSize: '1.2rem' }}>
                        <li className={NavbarStyles.builderOptions} onClick={() => setCurrentTabIndex(0)}>Form Builder</li>
                        <li className={NavbarStyles.builderOptions} onClick={() => setCurrentTabIndex(1)}>Form Settings</li>
                        <li className={NavbarStyles.builderOptions} onClick={() => setCurrentTabIndex(2)}>Workflow Builder</li>
                    </ul>
                </div>
            </div>
        )

        const profile = (
            <>
                <div style={{ display: 'flex', gap: '0.5rem', marginRight: '0.5rem', alignItems: 'center' }}>
                    <Button label='Save' loading={loading} style={{ backgroundColor: '#003459', color: '#F7F9FA', border: '0' }} onClick={e => updateForm(e)} />
                    <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{account?.name}</div>
                        <div>Power Admin</div>
                    </div>
                    <Image src={Avatar} width={36} height={36} alt={'Avatar'} style={{ cursor: 'pointer' }} onClick={() => setSignout(prev => !prev)} />
                </div>
                {signout &&
                    <div style={{ position: 'absolute', right: '0', backgroundColor: 'lightgrey', width: '200px', padding: '2rem 0 0.5rem 3.5rem', height: '100px' }}>
                        <Button label='Log Out' style={{ backgroundColor: '#003459', color: '#F7F9FA', border: '0' }} onClick={() => instance.logoutPopup()} />
                    </div>
                }
            </>
        )

        return (
            <div className='mt-2' >
                <Menubar start={logoContainer} end={profile} />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Update Form</title>
                <link rel='icon' sizes='32x32' href='/form-builder-studio/logo.png' />
            </Head>
            <AuthenticatedTemplate>
                <Toast ref={toast} />
                <div className='mt-2'>
                    <FormHeader />
                    {currentTabIndex === 0 &&
                        <DndContext
                            onDragEnd={(event) => handleDragEnd(event, metadata, addMetadata, setMetadata, setMainFormIds)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <ComponentPanel />
                                <div>
                                    <div style={{ textAlign: 'center', color: 'gray' }}>
                                        <h2>{data.name}</h2>
                                        <h4>{`Date Created: ${createUserFriendlyDate(data.dateCreated)}`}</h4>
                                    </div>
                                    <Card style={{ border: '1px solid black', width: '800px', padding: '0 1rem 1rem 1rem' }}>
                                        <div style={{ gap: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <PreviewButton id={id} footer={formDefinition?.footer} metadata={metadata} conditions={conditions} conditionMapper={conditionMapper} validationMapper={validationMapper} assignValuesNested={assignValuesNested} setMetadata={setMetadata} inputs={inputs} handleInputChange={handleInputChange} errors={errors} />
                                                {/* <ConditionDialog metadata={metadata} addCondition={addCondition} deleteCondition={deleteCondition} conditionMapper={conditionMapper} conditions={conditions} setConditions={setConditions} validationMapper={validationMapper} /> */}
                                            </div>
                                        </div>
                                        <Droppable id='droppable-container-form'>
                                            <SortableContext items={mainFormIds} strategy={rectSortingStrategy}>
                                                <CreateComponents
                                                    metadata={metadata}
                                                    setMetadata={setMetadata}
                                                    openDialog={openDialog}
                                                    inputs={inputs}
                                                    handleInputChange={handleInputChange}
                                                    assignValuesNested={assignValuesNested}
                                                    errors={errors}
                                                    files={files}
                                                    setFiles={setFiles}
                                                    setInputs={setInputs}
                                                />
                                            </SortableContext>
                                        </Droppable>
                                        <div className='flex justify-content-end mt-1'>
                                            <label>{formDefinition.footer}</label>
                                        </div>
                                    </Card>
                                </div>
                                <div className={SettingsStyles.settingsMenu}>
                                    {renderDialog()}
                                </div>
                            </div>
                        </DndContext>
                    }
                    {currentTabIndex === 1 &&
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ComponentPanel />
                            <div>
                                <div style={{ textAlign: 'center', color: 'gray' }}>
                                    <h1>{data.name}</h1>
                                    <h3>{`Date Created: ${createUserFriendlyDate(data.dateCreated)}`}</h3>
                                </div>
                                <Card style={{ width: '800px', padding: '0 1rem 1rem 1rem' }}>
                                    <h3 style={{ color: '#003459' }}>General</h3>
                                    <SaveForm formDefinition={formDefinition} setFormDefinition={setFormDefinition} loading={loading} metadata={metadata} />
                                    <h3 style={{ color: '#003459' }}>Status</h3>
                                    <StatusButton api={api} formDefinition={formDefinition} setFormDefinition={setFormDefinition} />
                                    <h3 style={{ color: '#003459' }}>Share</h3>
                                    <ShareButton formDefinition={formDefinition} />
                                </Card>
                            </div>
                            <div className={SettingsStyles.settingsMenu}>
                                {renderDialog()}
                            </div>
                        </div>
                    }
                    {currentTabIndex === 2 &&
                        <Workflow formName={data.name} formId={id} />
                    }
                </div>
            </AuthenticatedTemplate >
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

        return {
            props: {
                id,
                data: res.data,
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