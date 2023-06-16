import { Dropdown } from "primereact/dropdown";

export default function SelectInput({ id, label, className, ...props }) {
    return (
        <span className="p-float-label mt-3 w-full">
            <Dropdown {...props} className={`w-full ${className}`} />
            <label htmlFor={id}  >{label}</label>
        </span>
    )
}