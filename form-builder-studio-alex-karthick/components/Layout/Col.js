import { memo } from "react"

function Col({ className, children }) {

    return (
        <div className={`col ${className}`} >{children}</div>
    )

}

export default memo(Col)