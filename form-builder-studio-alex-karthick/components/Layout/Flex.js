import { memo } from "react"

function Flex({ direction = 'row', className = '', children, ...props }) {
    return (
        <div {...props} className={`flex p-0 m-0 flex-${direction} ${className}`} >
            {children}
        </div>

    )

}

export default memo(Flex)