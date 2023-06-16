import { Handle, Position } from "reactflow"
// import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { Tooltip } from 'primereact/tooltip'
import { Button } from 'primereact/button'


export function EndNode(node) {


    return (
        <>
            <div className="shadow-2 border-round text-white w-6rem h-3rem bgPrimary" >
                <Handle type={'target'} position={Position.Top} />
                <div role={'button'} className="tooltip-button flex h-full justify-content-center align-content-center">
                    <strong className="flex align-items-center justify-content-center" >End</strong>
                </div>
            </div>
            {/* <Tooltip target=".tooltip-button" autoHide={false} position={'right'}  >
                <div className="flex align-items-center">
                    <Button tooltipOptions={{ showDelay: 1000, hideDelay: 300 }} type="button" icon="pi pi-times" onClick={() => node.data.onRemoveNode(node.id)} className="p-button-rounded"></Button>
                </div>
            </Tooltip> */}
            {/* <ConfirmPopup /> */}
        </>
    )
}

export default EndNode