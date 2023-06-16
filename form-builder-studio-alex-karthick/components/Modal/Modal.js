import { Dialog } from 'primereact/dialog';

export function Modal(props) {

    return (
        <Dialog header={props.header} visible={props.visible} onHide={props.onHide} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} {...props} >
            {props.children}
        </Dialog>
    )
}

export default Modal