import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMsal, useAccount } from '@azure/msal-react'


export default function RedirectoLogin() {

    const { instance, inProgress, accounts, result, error } = useMsal();
    const account = useAccount(accounts[0] || {});
    const router = useRouter();

    useEffect(() => {
        if (!account) {
            router.push('/');
        }
    }, [account, router])

    return (
        <div className='card form-horizontal mt-5' style={{'width': '45rem'}}>
            <div className='card-body'>
                <h2 className='text-center text-primary card-title mb-3'>Redirecting To Login Page</h2>
            </div>
        </div>
    )
}
