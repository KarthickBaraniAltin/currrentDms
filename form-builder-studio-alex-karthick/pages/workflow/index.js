"use client"

import { useCallback, useEffect, useState, useRef } from 'react';
import { useNodesState, useEdgesState, addEdge, ReactFlowProvider, updateEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import SideNavbar from '../../components/WorkflowNode/SideNavbar/SideNavbar';
import Canvas from '../../components/WorkflowNode/Canvas/Canvas'
import Navbar from '../../components/Navbar/Navbar';
import ApproverNode from '../../components/WorkflowNode/CustomNode/Approver/ApproverNode';
import EndNode from '../../components/WorkflowNode/CustomNode/EndNode/EndNode'
import StartNode from '../../components/WorkflowNode/CustomNode/StartNode/StartNode'
import Col from '../../components/Layout/Col'
import Flex from '../../components/Layout/Flex'

import AddNode from '../../components/WorkflowNode/CustomNode/AddNode/AddNode'
import { axiosGet } from '../../helpers/Axios';

import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner'

import { defaultNode, defaultEdge } from '../../components/WorkflowNode/Elements/Elements'
import Grid from '../../components/Layout/Grid';


const nodeType = {
  approver: ApproverNode,
  end: EndNode,
  start: StartNode,
  add: AddNode
}



export default function Workflow({ formName, formId }) {


  const getId = () => {
    const result = `dndnode_${lastNodeId}`
    setLastNodeId(prev => prev + 1)
    return result
  }
  const reactFlowWrapper = useRef(null)
  const edgeUpdateSuccessful = useRef(true)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentNodeId, setCurrentNodeId] = useState('')
  const [lastNodeId, setLastNodeId] = useState(0)
  const [loading, setLoading] = useState(false)

  const defaultApproverData = {
    approverName: '',
    requiredComments: false,
    reminderOption: {
      reminder: false,
      reminderTimes: 0,
      reminderInterval: 'Hours'
    }
  }

  const [approverData, setApproverData] = useState(defaultApproverData)

  const toast = useRef(null)


  const onConnect = useCallback((params) => {
    console.log(params)

    if (params.source === '1') {
      setNodes(nodes => {
        return nodes.map(node => {
          if (node.id === params.target && node.type === 'approver') {
            node.data = { ...node.data, level: 1 }
          }
          return node
        })
      })
    }

    if (params.source !== '1') {
      setNodes(nodes => {
        const nodeIndex = nodes.findIndex(node => node.id === params.source)
        console.log('find Node', nodeIndex)
        return nodes.map(node => {
          if (node.id === params.target && node.type === 'approver') {
            node.data = { ...node.data, level: nodes[nodeIndex].data.level + 1 }
            console.log('now', node.data)
          }
          return node
        })
      })
    }
    if (params.sourceHandle === 's-1') {
      return setEdges((eds) => addEdge({ ...params, type: 'smoothstep', label: 'Approved' }, eds))
    }
    if (params.sourceHandle === 's-2') {
      return setEdges((eds) => addEdge({ ...params, type: 'smoothstep', label: 'Rejected' }, eds))
    }

    return setEdges((eds) => addEdge({ ...params, type: 'smoothstep', type: 'smoothstep' }, eds))
  }, [])

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, [])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = e.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: e.clientX - reactFlowBounds.left,
        y: e.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          label: '',
          onRemoveNode,
          setCurrentNodeId,
          setApproverData
        },
      }

      setNodes((nds) => nds.concat(newNode));

    },
    [reactFlowInstance, lastNodeId]
  )

  const onRemoveNode = (nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId))
  }

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false
  }, [])

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els))
  }, [])

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    }
    edgeUpdateSuccessful.current = true

  }, [])

  useEffect(() => {
    setLoading(true)
    axiosGet(`WorkflowDefinition/${formId}`)
      .then(res => {
        const data = res.data.metadata.metadata
        console.log('data', data)
        setNodes(() => {
          return data.nodes.map(
            node => ({ ...node, data: { ...node.data, onRemoveNode, setCurrentNodeId, setApproverData } })
          )
        })
        setEdges(data.edges)
        let positionOf_ = data.nodes[data.nodes.length - 1].id.search('_')
        let getId = parseInt(data.nodes[data.nodes.length - 1].id.substring(positionOf_ + 1), 10) + 1
        setLastNodeId(getId)
      })
      .catch(err => {
        let node = [...defaultNode]
        node[0].data.label = formName
        setNodes(node)
        setEdges(defaultEdge)
        console.log(err)
      })
      .finally(() => setLoading(false))

  }, [formId])

  useEffect(() => {
    approverOnChange(currentNodeId, approverData)
  }, [approverData, setNodes])

  const approverOnChange = (nodeId, approverData) => {
    setNodes(nodes => {
      if (nodes.length > 0) {
        return nodes.map(node => {
          if (node.id === nodeId) {
            node.data = {
              ...node.data,
              approverData
            }
          }
          return node
        })
      }
      console.log('test', nodes)
      return nodes
    })
  }


  return (
    <>
      <Flex direction={'column'} className={'h-screen w-full'} >
        <Navbar formName={formName} formId={formId} setNodes={setNodes} setEdges={setEdges} nodes={nodes} edges={edges} toast={toast} />
        <Grid className={'m-0 p-0 h-full'} >
          <SideNavbar />
          <Col>
            {
              loading ?
                <div className="flex h-full justify-content-center align-items-center">
                  <ProgressSpinner className='color_primary' />
                </div>
                :
                <ReactFlowProvider>
                  <div className='h-full' ref={reactFlowWrapper}>
                    <Canvas
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      nodeTypes={nodeType}
                      onInit={setReactFlowInstance}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onEdgeUpdate={onEdgeUpdate}
                      onEdgeUpdateStart={onEdgeUpdateStart}
                      onEdgeUpdateEnd={onEdgeUpdateEnd}
                    />
                  </div>
                </ReactFlowProvider>
            }
          </Col>
        </Grid>
      </Flex>
      <Toast ref={toast} position={'top-right'} />
    </>
  )
}
