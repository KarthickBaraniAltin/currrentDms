import { InteractionType } from "@azure/msal-browser"
import { AuthenticatedTemplate, useMsalAuthentication } from "@azure/msal-react"
import { InputText } from "primereact/inputtext"
import { DataTable } from "primereact/datatable"
import { useEffect, useState } from "react"
import { getFormDefinition } from "../../../api/apiCalls"
import { useApi } from "../../../hooks/useApi"
import { formBuilderApiRequest } from "../../../src/msalConfig"
import Head from "next/head"
import { Column } from "primereact/column"
import { Card } from "primereact/card"

export default function Home({ data }) {

    const { acquireToken } = useMsalAuthentication(InteractionType.Silent, formBuilderApiRequest)
    const { callApi, loading } = useApi()

    // Below code is for dashboard, we can movi it into useDashboard
    const [selectedValue, setSelectedValue] = useState({})
    const [values, setValues] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        page: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
        filters: {
            'global': { value: '', matchMode: 'contains' }
        }
    })

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
                url: `/form-builder-studio/api/form-submission/filter/`,
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${accessToken}`
                },
                data: {
                    formDefinitionId: data.id,
                    query: queryString
                }
            }

            const res = await callApi(params)
            console.log('Res = ', res)
            setValues(res?.data?.formSubmissions)
            setTotalRecords(res?.data?.count)
        }

        loadLazyData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lazyParams, loadLazyTimeout, acquireToken])


    /**
     * This function takes in an object of lazy params, and returns a query string representation of those params. 
     * It iterates over each key in the lazyParams object, and if the key is not 'filters', it appends the key and its value to the query string, separated by an '=' sign. 
     * If the key is 'filters', it only appends the 'global' key from the 'filters' object to the query string. The function returns the query string, with the trailing '&' character removed.
     *
     * @param {Object} lazyParams - The object of lazy params to be transformed into a query string.
     * @returns {string} The query string representation of the lazy params.
     */
    const lazyParamsToQueryString = (lazyParams) => {
        let queryString = "?";
        for (const key in lazyParams) {
            if (key !== 'filters') {
                if (lazyParams[key] !== null && lazyParams[key] !== undefined) {
                    queryString += `${key}=${lazyParams[key]}&`;
                }
            } else if (lazyParams.filters.global.value) {
                queryString += `global=${lazyParams.filters.global.value}&`;
            }
        }
        return queryString.slice(0, -1);
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

    const renderHeader = () => {
        return (
            <>
                <div className='flex justify-content-between'>
                    Form Data
                    <span className="p-input-icon-left" >
                        <i className="pi pi-search" />
                        <InputText value={lazyParams.filters.global.value ?? ''} onChange={onGlobalFilterChange} placeholder="Search" />
                    </span>
                </div>
            </>
        )
    }

    const createDataTableColumns = () => {
        console.log("Data = ", data)
        return (
            Object.values(data.metadata.metadata).map((value) => {
                const { name, label, type } = value

                if (type === 'header' || type === 'subtitle' || type === 'file' || type === 'image') {
                    return <></>
                }

                return (
                    <Column key={name} field={"data." + name} header={label} sortable />
                )
            })
        )
    }

    return (
        <>
            <Head>
                <title>Form Data Dashboard</title>
                <link rel='icon' sizes='32x32' href='/form-builder-studio/logo.png' />
            </Head>
            <div>
                <AuthenticatedTemplate>
                    <div className="mt-4">
                        <Card className='card w-75 form-horizontal mt-2 mb-3' style={{ 'width': '100%' }} >
                            <div className='card-body'>
                                { data.metadata.metadata && 
                                    <DataTable 
                                        value={values} lazy responsiveLayout='scroll' columnResizeMode='expand'
                                        dataKey='id' paginator first={lazyParams.first} rows={lazyParams.rows}
                                        totalRecords={totalRecords} onPage={onPage} onSort={onSort}
                                        sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                                        onFilter={onFilter} filters={lazyParams.filters} header={renderHeader}
                                        size='small' loading={loading} onSelectionChange={onSelectionChange}
                                        selection={selectedValue} globalFilterFields={[]}
                                    >
                                        { createDataTableColumns() }
                                    </DataTable>
                                }
                            </div>
                        </Card>
                    </div>
                </AuthenticatedTemplate>
            </div>
        </>
    )
}

export async function getStaticPaths({ }) {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


export async function getStaticProps(context) {
    const { formDefinitionId } = context.params;

    try {
        const res = await getFormDefinition(formDefinitionId)

        return {
            props: {
                formDefinitionId,
                data: res.data
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