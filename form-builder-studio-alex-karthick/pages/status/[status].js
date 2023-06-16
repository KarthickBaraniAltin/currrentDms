import { useRouter } from "next/router";
import Datagrid from "../../components/WorkflowNode/Datagrid/Datagrid";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { axiosGet } from "../../helpers/Axios";
import { useMsal } from "@azure/msal-react";
import Flex from "../../components/Layout/Flex";
import Header from "../../components/Header/Header";

export default function Status(props) {

    const { accounts } = useMsal()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    console.log('props', props)

    const username = accounts.length > 0 ? accounts[0].username : ''

    const router = useRouter()
    const { status } = router.query

    const actionButton = (data) => {
        // console.log('data', data)
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

    const columns = [
        { header: 'Action', body: actionButton },
        { field: 'formId', header: 'Id' },
        { field: 'formName', header: 'Form Name', body: (data) => (data.formDefinition.name), sortable: true },
        {
            field: 'submittedAtUtc', header: 'Submited On',
            body: (data) => (` ${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: "America/Los_Angeles" }).format(new Date(data.submittedAtUtc))}`),
            sortable: true
        },
        { field: 'stageTitle', header: 'Stage', sortable: true },
        { field: 'statusName', header: 'Status', sortable: true },
    ]



    useEffect(() => {
        setLoading(true)
        axiosGet(`Form/${status}/${username}`)
            .then(res => {
                setData(res.data)
                console.log('data ', res.data)
            })
            .catch(
                err => console.log(err)
            )
            .finally(() => setLoading(false))

    }, [status])


    return (
        <Flex direction={'column'} className="h-full w-full">
            <Header size={2} >{status === 'Pending' ? 'Awaiting for me' : status}</Header>
            <Datagrid loading={loading} data={data} columns={columns} sortable={true} />
        </Flex>
    )
}