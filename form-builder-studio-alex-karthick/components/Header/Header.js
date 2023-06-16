import { createElement } from "react"


function Header(props) {

    function header() {
        return createElement(`h${props.size}`, { ...props }, <>{props.children}</>)
    }

    return (header())
}

export default Header