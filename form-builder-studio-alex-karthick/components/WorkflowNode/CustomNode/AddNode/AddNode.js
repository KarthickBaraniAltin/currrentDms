import { Handle, Position } from "reactflow"

function AddNode() {
    return (
        <>
            <Handle type={'target'} className="p-1" id="add-1" position={Position.Top} />
            <div role={'button'} className="flex surface-border border-dashed justify-content-center align-items-center border-round hover:surface-100 text-white w-6rem h-3rem" >
                <p className="font-semibold text-xl text-500">Add</p>
            </div>
        </>
    )
}

export default AddNode
