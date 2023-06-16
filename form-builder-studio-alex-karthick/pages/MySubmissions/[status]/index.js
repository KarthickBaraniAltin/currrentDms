import Head from 'next/head'
import { AuthenticatedTemplate, useAccount, useMsal, useMsalAuthentication } from '@azure/msal-react'
import { InteractionType } from '@azure/msal-browser'
import React, { useState, useEffect } from 'react'
import { useApi } from '../../../hooks/useApi'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useRouter } from 'next/router'
import Flex from '../../../components/Layout/Flex'
import Header from '../../../components/Header/Header'
import { formBuilderApiRequest } from '../../../src/msalConfig'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import useUtilityFunctions from '../../../hooks/useUtilityFunctions'
import { axiosGet } from '../../../helpers/Axios'
import FillOutNewForm from '../../../components/FillOutNewForm/FillOutNewForm'
import { dateFormat } from '../../../utillites/dateFormat'
import Datagrid from '../../../components/WorkflowNode/Datagrid/Datagrid'


const api = process.env.NEXT_PUBLIC_FORM_BUILDER_API

export default function Home({ status }) {

  const statusMapper = {
    'Submitted': 1,
    'Pending': 2,
    'Approved': 3,
    'Rejected': 4,
    'RevisionRequired': 5,
    'Completed': 6,
    'Processed': 7
  }

  const statusHeaderMapper = {
    'Submitted': 'In Progress',
    'Pending': 'Awaiting For Me',
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'RevisionRequired': 'Revision Required',
    'Completed': 'Completed',
    'Processed': 'Processed'
  }

  const router = useRouter()
  const { accounts, instance } = useMsal()
  const account = useAccount(accounts[0] ?? {})
  const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)
  const { loading, callApi } = useApi()
  const headerStyle = { fontWeight: '600', fontSize: '15.5px', color: '#000' }
  const [formSubmissions, setFormSubmissions] = useState(null)
  const [totalRecords, setTotalRecords] = useState(0)
  const { createUserFriendlyDate, createUserFriendlyId } = useUtilityFunctions()
  const [selectedFormSubmission, setSelectedFormSubmission] = useState()


  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  const { username } = accounts.length > 0 ? accounts[0] : {}

  const actionButton = (data) => {
    return (
      <>
        <Button icon="pi pi-pencil" rounded text aria-label="Edit" disabled={!data.formStatus === "InReview"} onClick={
          () => {
            router.push(`/view/${data.formDefinitionId}/form-data/${data.formSubmissionDataId}`)
          }
        } />
        <Button icon="pi pi-eye" rounded text aria-label="view" />
      </>
    )
  }

  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    rows: 10,
    sortField: 'lastUpdatedAtUtc',
    sortOrder: -1,
    filters: {
      'global': { value: '', matchMode: 'contains' }
    }
  })

  // Variables for Fill Out New Form button functionality
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [formDefinition, setFormDefinition] = useState(null)
  const [selectedFormDefinition, setSelectedFormDefinition] = useState()
  const [newFormsTotalRecords, setNewFormsTotalRecords] = useState(0)
  const [lazyNewForms, setLazyNewForms] = useState({
    first: 0,
    page: 0,
    rows: 10,
  })

  const lazyParamsToQueryString = (lazyParams) => {
    let queryString = `?`;
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
    const loadLazyData = async () => {
      if (loadLazyTimeout) {
        clearTimeout(loadLazyTimeout)
      }

      const { accessToken } = await acquireToken()

      const queryString = lazyParamsToQueryString(lazyParams)
      const formSubmissionParams = {
        method: 'GET',
        url: `${api}/Form/${status}/${username}${queryString}`,
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

      const result = await callApi(formSubmissionParams)
      console.log(`${api}/Form/${status}/${username}/${queryString}`, result?.data)
      setFormSubmissions(result?.data?.formSubmissions)
      setTotalRecords(result?.data?.count)

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
  }, [lazyParams, lazyNewForms, loadLazyTimeout, acquireToken, account, status])

  // useEffect(() => {
  //   setIsLoading(true)
  //   axiosGet(`Form/${status}/${username}`)
  //     .then(res => {
  //       setData(res.data)
  //       console.log('data ', res.data.formSubmissions)
  //     })
  //     .catch(
  //       err => console.log('err from form status', err)
  //     )
  //     .finally(() => setIsLoading(false))

  // }, [status, username])

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

  const renderHeader = () => {
    return (
      <>
        <div className='table-header'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Header size={2} className={'colorPrimary'} >{status === 'Pending' ? 'Awaiting for me' : status}</Header>
            </div>
            <div>
              <span className="p-input-icon-left" style={{ marginRight: '1rem' }}>
                <i className="pi pi-search" />
                <InputText value={lazyParams.filters.global.value ?? ''} onChange={onGlobalFilterChange} placeholder="Search" />
              </span>
              <Button label='Fill Out New Form' onClick={() => setIsButtonClicked(prev => !prev)} />
              <FillOutNewForm isButtonClicked={isButtonClicked} setIsButtonClicked={setIsButtonClicked} formDefinition={formDefinition}
                lazyNewForms={lazyNewForms} setLazyNewForms={setLazyNewForms} selectedFormDefinition={selectedFormDefinition}
                setSelectedFormDefinition={setSelectedFormDefinition} newFormsTotalRecords={newFormsTotalRecords} loading={loading}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  const lastUpdatedBodyTemplate = (formSubmission) => {
    const { lastUpdatedAtUtc } = formSubmission
    // return dateFormat(lastUpdatedAtUtc)
    return createUserFriendlyDate(lastUpdatedAtUtc)
  }

  const handleRowClick = (value) => {
    router.push(`/view/${value.formDefinition.id}/form-data/${value.id}`)
  }

  const columns = [
    { header: 'Action', body: actionButton },
    { field: 'formId', header: 'Form Id' },
    { field: 'formName', header: 'Form Name', body: (data) => (data.formDefinition.name), sortable: true },
    { field: 'statusName', header: 'Status', sortable: true },
    {
      field: 'stageTitle', header: 'Workflow Stage', body: (data) => {
        if (data.currentApprover !== '')
          return `${data.stageTitle} [${data.currentApprover}]`
        return `${data.stageTitle}`
      }, sortable: true
    },
    {
      field: 'submittedAtUtc', header: 'Last Updated',
      body: (data) => dateFormat(data.lastUpdatedAtUtc),
      sortable: true
    },
  ]


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
            value={formSubmissions} lazy responsiveLayout='scroll' columnResizeMode='expand'
            dataKey='id' paginator first={lazyParams.first} rows={lazyParams.rows}
            onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
            totalRecords={totalRecords} onPage={onPage} onFilter={onFilter} filters={lazyParams.filters} header={renderHeader}
            size='small' loading={loading} globalFilterFields={[]}
          >
            {columns.map((col) => <Column {...col} />)}
          </DataTable>
        </Flex>
      </AuthenticatedTemplate>
    </>
  )
}

export async function getServerSideProps(context) {
  const { status } = context.params;

  try {
    return {
      props: {
        status,
      }
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        status: 1
      }
    }
  }
}