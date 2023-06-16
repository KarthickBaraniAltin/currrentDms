import { useEffect, useState } from "react";
import { useAccount, useMsal } from "@azure/msal-react"

const useRoles = () => {
    
    const [roles, setRoles] = useState()
    const { instance, accounts } = useMsal()
    const account = useAccount(accounts[0] || {})

    useEffect(() => {
        const currentAccount = instance.getActiveAccount()
        if (currentAccount && currentAccount.idTokenClaims['roles']) {
            setRoles(currentAccount.idTokenClaims['roles'])
        }
    },[instance, account])

    return roles
}

export default useRoles