import Head from 'next/head'
import { AuthenticatedTemplate, useAccount, useMsal, useMsalAuthentication } from '@azure/msal-react'
import { InteractionType } from '@azure/msal-browser'
import React, { useState, useEffect } from 'react'
import { formBuilderApiRequest } from '../../src/msalConfig'
import { useApi } from '../../hooks/useApi'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from "primereact/inputtext"
import Flex from '../../components/Layout/Flex'
import useUtilityFunctions from '../../hooks/useUtilityFunctions'
import Header from '../../components/Header/Header'
import useRoles from '../../hooks/useRoles'
import { useRouter } from 'next/router'

export default function Home() {
  const { accounts, instance } = useMsal()
  const account = useAccount(accounts[0] ?? {})
  const roles = useRoles()
  const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)
  const { loading, callApi } = useApi()
  const router = useRouter()
  const headerStyle = {fontWeight: '600', fontSize: '15.5px', color: '#000'} 
  const { createUserFriendlyId, createUserFriendlyDate } = useUtilityFunctions()
  const [formSubmission, setFormSubmissions] = useState(null)
  const [totalRecords, setTotalRecords] = useState(0)
  const [lazyParams, setLazyParams] = useState({
      first: 0,
      page: 0,
      rows: 10,
      sortField: 'updatedAtUtc',
      sortOrder: -1,
      filters: {
          'global': {value: '', matchMode: 'contains'}
      }
  })

  // Variables for Fill Out New Form button functionality
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [formDefinition, setFormDefinition] = useState(null)
  const [selectedFormSubmission, setSelectedFormSubmission] = useState()
  const [newFormsTotalRecords, setNewFormsTotalRecords] = useState(0)
  const [lazyNewForms, setLazyNewForms] = useState({
    first: 0,
    page: 0,
    rows: 10,
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

  const lazyNewFormsToQueryString = (lazyNewForms) => {
    return `?Page=${lazyNewForms.page}&sortOrder=-1`
  }

  let loadLazyTimeout = null 
  useEffect(() => {
      const loadLazyData = async() => {
          if (loadLazyTimeout) {
              clearTimeout(loadLazyTimeout)
          }

          const { accessToken } = await acquireToken()
          
          const queryString = lazyParamsToQueryString(lazyParams)
          const formSubmissionParams = {
              method: 'POST',
              url: `/form-builder-studio/api/form-submission-filter`,
              headers: {
                  Accept: '*/*',
                  Authorization: `Bearer ${accessToken}`
              },
              data: {
                query: queryString
              }
          }

          const newFormString = lazyNewFormsToQueryString(lazyNewForms)
          const formDefinitionParams = {
            method: 'POST',
            url: `/form-builder-studio/api/formDefinition`,
            headers: {
              Accept: '*/*',
              Authorization: `Bearer ${accessToken}`
            },
            data: {
              query: newFormString
            }
          }

          // Used for form submissions dashboard
          const formSubmissionRes = await callApi(formSubmissionParams)
          const currentFormSubmission = formSubmissionRes?.data?.formSubmissions
          setFormSubmissions(currentFormSubmission)
          setTotalRecords(formSubmissionRes?.data?.count)

          // Used for Fill Out New Form button functionality
          const formDefinitionRes = await callApi(formDefinitionParams)
          const currentFormDefinitions = formDefinitionRes?.data?.formDefinitions
          const convertedFormDefinitions = currentFormDefinitions?.map(formDefinition => {
            const formattedDate = createUserFriendlyDate(formDefinition.dateCreated)
            const formattedId = createUserFriendlyId(formDefinition.id, formDefinition.name)

            return {
              ...formDefinition,
              dateCreated: formattedDate,
              formId: formattedId
            }
          })
          setFormDefinition(convertedFormDefinitions)
          setNewFormsTotalRecords(formDefinitionRes?.data?.count)
      }

      if (account) {
        loadLazyData()
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams, lazyNewForms, loadLazyTimeout, acquireToken, account])

  const renderHeader = () => {

    const toViewPage = (id) => {
      router.push(`/view/${id}`);
    }

    const onNewFormsPage = (event) => {
      setLazyNewForms(event)
    }

    console.log('roles = ', roles)
    return (
      <>
        {roles && roles.includes('Admin') &&
          <div className='table-header'>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <span className="p-input-icon-left" style={{marginRight: '1rem'}}>
                  <i className="pi pi-search" />
                  <InputText value={lazyParams.filters.global.value ?? ''} onChange={onGlobalFilterChange} placeholder="Search" />
              </span>
            </div>
          </div>
        }
      </> 
    )
  }

  const onPage = (event) => {
    setLazyParams(event)
  }

  const onFilter = (event) => {
      event['first'] = 0
      setLazyParams(event)
  }

  const onSort = (event) => {
    setLazyParams(event)
  }

  const onGlobalFilterChange = (e) => {
      const value = e.target.value
      let _filters = { ...lazyParams.filters }
      _filters['global'].value = value
  
      setLazyParams({ ...lazyParams })
  }

  const formItems = [
    {
        label: 'Drafts',
    },
    {
        label: 'In Progress',
    },
    {
        label: 'Awaiting For Me',
    },
    {
        label: 'Approved',
    },
    {
        label: 'Rejected',
    }
  ]

  const lastUpdatedBodyTemplate = (formSubmission) => {
    const { lastUpdatedAtUtc } = formSubmission

    return <td>{createUserFriendlyDate(lastUpdatedAtUtc)}</td>
  }

  const handleRowClick = (value) => {
    router.push(`/view/${value.formDefinition.id}/form-data/${value.id}`)
  }

  return (
      <>
          <Head>
              <title>Form Submissions</title>
              <link rel='icon' sizes='32x32' href='/form-builder-studio/logo.png' />
          </Head>
          <AuthenticatedTemplate>
              <Flex direction={'column'} className={'m-0 p-0 h-full w-full'}>
                <Header size={2}>Form Submissions</Header>
                    <DataTable 
                        value={formSubmission} lazy columnResizeMode='expand'
                        dataKey='id' paginator first={lazyParams.first} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder} totalRecords={totalRecords}
                        onPage={onPage} onFilter={onFilter} filters={lazyParams.filters} header={renderHeader} 
                        size='small' loading={loading} globalFilterFields={[]} metaKeySelection={false} 
                        selectionMode='single' selection={selectedFormSubmission} 
                        onSelectionChange={(e) => handleRowClick(e.value)}
                    >
                      <Column className='dashboardTitle' field='formId' header='Form ID' headerStyle={{...headerStyle, width: '18%'}} />
                      <Column className='dashboardTitle' field='formDefinition.name' header='Form Title' headerStyle={{...headerStyle, width: '16%'}} />
                      <Column className='dashboardTitle' field='statusName' header='Status' headerStyle={{...headerStyle, width: '14%'}} />
                      <Column className='dashboardTitle' field='stageTitle' header='Current Stage' headerStyle={{...headerStyle, width: '14%'}} />
                      <Column className='dashboardTitle' field='userFullLegalName' header='Submitted By' headerStyle={{...headerStyle, width: '18%'}} />
                      <Column className='dashboardTitle' field='lastUpdatedAtUtc' header='Last Updated' body={lastUpdatedBodyTemplate} sortable headerStyle={{...headerStyle, width: '25%'}} />
                    </DataTable>
            </Flex>
          </AuthenticatedTemplate>
      </>
  )
}