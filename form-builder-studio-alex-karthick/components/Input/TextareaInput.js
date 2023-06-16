import { InputTextarea } from "primereact/inputtextarea"


export default function TextareaInput(props) {
    return (
        <>
            <span className="p-float-label my-5 w-full">
                <InputTextarea {...props} />
                <label htmlFor={props.id} className={`w-full ${props.className}`} >{props.label}</label>
            </span>
        </>
    )
}