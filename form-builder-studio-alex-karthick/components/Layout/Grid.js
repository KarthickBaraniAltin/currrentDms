import { memo } from "react"

function Grid({ className, children }) {
    return (
        <div className={`grid ${className}`} >
            {children}
        </div>
    )
}
export default memo(Grid)