import { createElement } from "react"


function SideMenuHeader(props) {

    function header() {
        const header = createElement(`h${props.size}`, { ...props }, <>{props.children}</>)
        return header
    }

    return (header())
}

export default SideMenuHeader