import { Button } from "primereact/button"
import { memo } from "react"
import { defaultNode, defaultEdge } from '../WorkflowNode/Elements/Elements'
import { axiosPost } from '../../helpers/Axios'
import { useMsal } from "@azure/msal-react"

function Navbar({ formName, formId, setNodes, setEdges, nodes, edges, toast }) {

    const { accounts } = useMsal()
    const account = accounts[0] ? accounts[0] : {}

    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Saved', life: 3000 })
    }

    const onSave = () => {
        console.log('node and edges', { nodes: nodes, edges: edges })
        const stringifyData = JSON.stringify({ nodes: nodes, edges: edges })
        const postData = {
            workflowDefinitionId: self.crypto.randomUUID(),
            formDefinitionId: formId,
            workflowName: formName,
            metadataId: '',
            createdBy: account.username,
            createdOn: new Date(),
            modifiedBy: account.username,
            modifiedOn: new Date(),
            metadata: {
                id: '',
                createdAtUtc: new Date(),
                metadata: stringifyData
            }
        }
        console.log('post data', postData)

        axiosPost('WorkflowDefinition', postData)
            .then((res) => {
                show()
                console.log(res)
            })
            .catch(err => console.log('err', err))
    }

    const onReset = () => {
        let node = [...defaultNode]
        node[0].data.label = formName
        setNodes(node)
        setEdges(defaultEdge)
        localStorage.setItem('dndId', 0)
    }

    return (
        <div className='flex justify-content-between align-items-center p-1 bg-white shadow-1'>
            {/* <img src={csnLogo.src} alt={'CSN Logo'} width={'80px'} height={'25px'} /> */}
            <h2 style={{ color: '#004990' }} >{`Workflow Builder - ${formName}`}</h2>
            <div className='flex gap-2'>
                <Button size={'small'} label='Reset' onClick={onReset} style={{ backgroundColor: '#fffbe5', color: '#ffd200', borderStyle: 'none' }} />
                <Button size={'small'} label='Save' onClick={onSave} style={{ backgroundColor: '#004990', color: '#fff', borderStyle: 'none' }} />
            </div>
        </div>
    )
}

export default memo(Navbar)