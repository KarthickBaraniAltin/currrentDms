import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react"
import Link from 'next/link'
import { useAccount, useMsal, useMsalAuthentication } from '@azure/msal-react'
import { InteractionType } from '@azure/msal-browser'
import React, { useState, useEffect } from 'react'
import { formBuilderApiRequest } from '../src/msalConfig'
import { useApi } from '../hooks/useApi'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from "primereact/inputtext"
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import Flex from '../components/Layout/Flex'
import Header from '../components/Header/Header'
import useUtilityFunctions from "../hooks/useUtilityFunctions"
import useRoles from "../hooks/useRoles"
import { dateFormat } from "../utillites/dateFormat"

export default function Home() {
    const { accounts } = useMsal()
    const account = useAccount(accounts[0] ?? {})
    const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)
    const roles = useRoles()
    const { loading, callApi } = useApi()
    const { loading: createFormLoading, callApi: callCreateFormApi } = useApi()
    const headerStyle = { fontWeight: '600', fontSize: '15.5px', color: '#000' }
    const { createUserFriendlyId, createUserFriendlyDate } = useUtilityFunctions()
    const [formDefinitions, setFormDefinitions] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedValue, setSelectedValue] = useState({})
    const [totalRecords, setTotalRecords] = useState(0)
    const router = useRouter()
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        page: 0,
        rows: 10,
        sortField: 'dateCreated',
        sortOrder: -1,
        filters: {
            'global': { value: '', matchMode: 'contains' }
        }
    })

    const lazyParamsToQueryString = (lazyParams) => {
        let queryString = "?";
        for (const key in lazyParams) {
            if (key !== 'filters') {
                if (lazyParams[key] !== null && lazyParams[key] !== undefined) {
                    if (key === 'first') continue
                    queryString += `${key}=${lazyParams[key]}&`
                }
            } else if (lazyParams.filters.global.value) {
                queryString += `global=${lazyParams.filters.global.value}&`
            }
        }
        return queryString.slice(0, -1)
    }
    let loadLazyTimeout = null

    useEffect(() => {
        const loadLazyData = async () => {
            if (loadLazyTimeout) {
                clearTimeout(loadLazyTimeout)
            }

            const { accessToken } = await acquireToken()

            const queryString = lazyParamsToQueryString(lazyParams)
            const params = {
                method: 'POST',
                url: `/form-builder-studio/api/formDefinition`,
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${accessToken}`
                },
                data: {
                    query: queryString
                }
            }

            const res = await callApi(params)

            const currentFormDefinitions = res?.data?.formDefinitions
            const formDefinitionsWithCorrectId = currentFormDefinitions?.map(formDefinition => {
                const formattedId = createUserFriendlyId(formDefinition.id, formDefinition.name)
                const formattedDate = createUserFriendlyDate(formDefinition.dateCreated)
                // const formattedDate = dateFormat(formDefinition.dateCreated)

                return {
                    ...formDefinition,
                    dateCreated: formattedDate,
                    formId: formattedId
                }
            })

            setFormDefinitions(formDefinitionsWithCorrectId)
            setTotalRecords(res?.data?.count)
        }

        if (account) {
            loadLazyData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lazyParams, loadLazyTimeout, acquireToken, account])


    const renderHeader = () => {
        return (
            <>
                <div className='table-header'>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span className='pi pi-plus' style={{ alignSelf: 'center', cursor: 'pointer' }} onClick={() => setIsVisible(true)} />
                        <span className="p-input-icon-left" style={{ marginLeft: '1rem' }}>
                            <i className="pi pi-search" />
                            <InputText value={lazyParams.filters.global.value ?? ''} onChange={onGlobalFilterChange} placeholder="Search" />
                        </span>
                    </div>
                </div>
            </>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <span>
                <Link href='/view/[id]' as={`/view/${rowData.id}`} rel='noopener noreferrer' style={{ marginRight: '0.2rem' }}>
                    <span className='pi pi-eye' style={{ cursor: 'pointer', color: '#034692' }} />
                </Link>
                <Link href='/update/[id]' as={`/update/${rowData.id}`} rel='noopener noreferrer'>
                    <span className='material-icons' style={{ cursor: 'pointer', color: '#034692', fontSize: '18px', paddingRight: '3px' }}>edit_square</span>
                </Link>
                <Link href='/test/form-data-dashboard/[id]' as={`/test/form-data-dashboard/${rowData.id}`} rel='noopener noreferrer'>
                    <span className='pi pi-bookmark-fill' style={{ cursor: 'pointer', color: '#034692', fontSize: '18px', paddingRight: '3px' }}></span>
                </Link>
            </span>
        )
    }

    const createForm = async (event) => {
        event.preventDefault()

        const { accessToken } = await acquireToken()
        const params = {
            method: 'POST',
            url: `/form-builder-studio/api/form-definition`,
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                name: name,
                description: description,
                authorDisplayName: account.name,
                authorLegalName: account.name,
                authorId: account.localAccountId,
                authorEmail: account.username,
                metadata: {
                    metadata: []
                }
            }
        }

        const res = await callCreateFormApi(params)
        if (res) {
            router.push(`/update/${res.data.id}`)
        }
    }

    const onPage = (event) => {
        setLazyParams(event)
    }

    const onSort = (event) => {
        setLazyParams(event)
    }

    const onFilter = (event) => {
        event['first'] = 0
        setLazyParams(event)
    }

    const onSelectionChange = (event) => {
        const { value } = event
        setSelectedValue(value)
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value
        let _filters = { ...lazyParams.filters }
        _filters['global'].value = value

        setLazyParams({ ...lazyParams })
    }

    return (
        <>
            <AuthenticatedTemplate>
                <Dialog header='Create New Form' style={{ width: '50%' }} visible={isVisible} onHide={() => setIsVisible(false)}>
                    <div className='flex flex-column'>
                        <div className='mt-1'>
                            <div className='flex flex-column mt-2'>
                                <label>Form Definition Name</label>
                                <InputText value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className='flex flex-column mt-2'>
                                <label>Form Definition Description</label>
                                <InputTextarea value={description} onChange={e => setDescription(e.target.value)} autoResize />
                            </div>
                            <div className='flex flex-column mt-2'>
                                <label>User Name</label>
                                <InputText value={account?.name} disabled />
                            </div>
                            <div className='flex flex-column mt-2'>
                                <label>User Email</label>
                                <InputText value={account?.username} disabled />
                            </div>
                        </div>
                        <Button className='mt-3' label='Create' style={{ width: '100px' }} loading={createFormLoading} onClick={createForm} />
                    </div>
                </Dialog>
                {/* {roles && roles.includes('Admin') && */}
                {true &&
                    <Flex direction={'column'} className={'m-0 p-0 h-full w-full'} >
                        <Header size={2}>My Forms</Header>
                        <DataTable
                            className="h-full w-full"
                            value={formDefinitions} lazy responsiveLayout='scroll' columnResizeMode='expand'
                            dataKey='id' paginator first={lazyParams.first} rows={lazyParams.rows}
                            totalRecords={totalRecords} onPage={onPage} onSort={onSort}
                            sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                            onFilter={onFilter} filters={lazyParams.filters} header={renderHeader}
                            size='small' loading={loading} onSelectionChange={onSelectionChange}
                            selection={selectedValue} globalFilterFields={[]}
                        >
                            <Column field='action' headerStyle={{ ...headerStyle, width: '6%' }} header='Action' body={actionBodyTemplate} />
                            <Column className='dashboardTitle' field='formId' header='Form Id' headerStyle={{ ...headerStyle, width: '15%' }} sortable />
                            <Column className='dashboardTitle' field='name' header='Form Name' headerStyle={{ ...headerStyle, width: '15%' }} sortable />
                            <Column className='dashboardTitle' field='description' header='Description' headerStyle={{ ...headerStyle, width: '25%' }} sortable />
                            <Column className='dashboardTitle' field='authorLegalName' header='Author Name' headerStyle={{ ...headerStyle, width: '15%' }} sortable />
                            <Column className='dashboardTitle' field='dateCreated' header='Date Created' headerStyle={{ ...headerStyle, width: '25%' }} sortable />
                            {/* <Column className='dashboardTitle' field='status' header='Status' headerStyle={{ ...headerStyle, width: '20%' }} sortable /> */}
                        </DataTable>
                    </Flex>
                }
            </AuthenticatedTemplate>
        </>
    )
}