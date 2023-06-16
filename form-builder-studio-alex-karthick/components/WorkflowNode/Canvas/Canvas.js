import { ReactFlow, Controls, MiniMap } from "reactflow"

function Canvas(props) {
    return (
        <>
            <ReactFlow  {...props} >
                <Controls position={'top-right'} />
                {/* <MiniMap /> */}
            </ReactFlow>
        </>
    )
}

export default Canvas