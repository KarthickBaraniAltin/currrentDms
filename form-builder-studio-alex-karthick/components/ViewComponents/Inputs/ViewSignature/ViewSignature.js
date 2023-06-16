import { InputText } from 'primereact/inputtext'
import { useRouter } from 'next/router'
import Label from '../../../SharedComponents/Label/Label'
import Errors from '../../../SharedComponents/Errors/Errors'
import Subtitle from '../../../SharedComponents/Subtitle/Subtitle'
import ComponentContainer from '../../../SharedComponents/ComponentContainer/ComponentContainer'
import LabelContainer from '../../../SharedComponents/LabelContainer/LabelContainer'
import InputsContainer from '../../../SharedComponents/InputsContainer/InputsContainer'
import clsx from 'clsx'
import sharedStyles from '../../../SharedComponents/Signature/Signature.module.css'
import DisplaySignatureInfo from '../../DisplaySignatureInfo/DisplaySignatureInfo'
import { useMsal, useAccount } from '@azure/msal-react'

export default function ViewSignature ({metadata, value, onChange, errors, formSubmission, formDefinitionData }) {
    const { name, label, subtitle, disabled, fontStyle, validations } = metadata
    const { authorLegalName, authorEmail } = formDefinitionData
    const router = useRouter()
    const { accounts } = useMsal()
    const account = useAccount(accounts[0] ?? {})

    metadata.validations = {
        signatureName: formDefinitionData.authorDisplayName
    }

    const onSignatureChange = (e) => {
        const signTime = new Date()
        onChange({target: {name: name, value: {
            signatureGuid: '',
            signTime: `${signTime}`,
            userId: account.localAccountId,
            fullLegalName: authorLegalName,
            email: authorEmail,
            securityLevel: 'Email, Account Authentication(None)',
            userIPv4: '',
            signatureAdoption: 'Pre-Selected Style',
            value: e.target.value
        }}})
    }

    return (
        <ComponentContainer>
            <LabelContainer>
                <Label label={label} validations={validations} />
            </LabelContainer>
            <InputsContainer>
                <InputText 
                    className={clsx('col-12', sharedStyles.signature, errors?.length > 0 && 'p-invalid')} 
                    name={name} 
                    value={value?.value} 
                    onChange={(e) => onSignatureChange(e)} 
                    style={{fontFamily: fontStyle}}
                    disabled={disabled}
                />
                <Subtitle subtitle={subtitle} />
                <Errors errors={errors} />
                {router.pathname.includes('/form-data/') && <DisplaySignatureInfo formSubmission={formSubmission} />}
            </InputsContainer>
        </ComponentContainer>
    )
}