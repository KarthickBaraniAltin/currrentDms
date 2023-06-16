import { Handle, Position } from "reactflow"


export function StartNode(node) {

    return (
        <>
            <div className="shadow-2 border-round text-white w-10rem h-4rem bgPrimary">
                <Handle type={'source'} id={'start-s-1'} position={Position.Bottom} />
                <Handle type={'target'} id={'start-t-1'} position={Position.Right} />
                <div className="flex flex-column h-full justify-content-center align-content-center gap-1">
                    <strong className="flex align-items-center justify-content-center text-center" >{node.data.label}</strong>
                </div>
            </div>
        </>
    )
}

export default StartNode