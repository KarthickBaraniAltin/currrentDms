import { useMsal, useAccount } from "@azure/msal-react"

export default function DisplaySignatureInfo({ formSubmission }) {
    const { accounts } = useMsal()
    const account = useAccount(accounts[0] ?? {})

    return (
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '0.2rem'}}>
            <div>{`Name: ${formSubmission?.fullLegalName}`}</div>
            <div>{`Email: ${formSubmission?.email}`}</div>
            <div>{`IP Address: ${formSubmission?.userIPv4}`}</div>
            <div>{`Date Submitted: ${new Date(formSubmission?.submittedAtUtc)}`}</div>
            <div>{`Security Level: ${formSubmission?.securityLevel}`}</div>
            <div>{`Signature ID: ${account.localAccountId}`}</div>
        </div>
    )
}