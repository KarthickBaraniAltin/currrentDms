import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react"

const useAuthorization = (roles) => {
    
    const [isAuthorized, setIsAuthorized] = useState(false)
    const { instance } = useMsal()

    useEffect(() => {
        const currentAccount = instance.getActiveAccount()

        if (currentAccount && currentAccount.idTokenClaims['roles']) {
            let intersection = roles.filter(role => currentAccount.idTokenClaims['roles'].includes(role))
            
            if (intersection.length > 0) {
                setIsAuthorized(true)
            }
        }
    },[instance])

    return isAuthorized
}

export default useAuthorization