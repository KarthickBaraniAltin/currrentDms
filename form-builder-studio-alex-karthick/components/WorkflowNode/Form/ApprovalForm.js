import TextInput from '../../Input/TextInput'
import Flex from '../../Layout/Flex'
import Header from '../../Header/Header'
import { Button } from 'primereact/button'
import TextareaInput from '../../Input/TextareaInput'
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react'
import { axiosPost } from '../../../helpers/Axios'
import { useMsal } from '@azure/msal-react'


function ApprovalForm({ formId, metaDataId, submissionId, type, onHide, showSuccess }) {

    const defaultValue = {
        type,
        comments: '',
        notes: ''
    }

    const { accounts } = useMsal()
    const { name, username } = accounts.length > 0 ? accounts[0] : {}

    const [formData, setFormData] = useState(defaultValue)



    const changeHandler = (e) => {
        const { value, name } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
    }


    return (
        <>
            <form >
                <div className={'flex flex-column gap-2'} ></div>
                <Header size={1} ><small> You are {type} this form</small></Header>
                <Header size={3} >Review :</Header>
                <TextareaInput label={'Reason'} name={'comments'} value={formData.comments} onChange={changeHandler} autoResize cols={75} />
                <TextareaInput label={'Additional notes'} name={'notes'} value={formData.notes} onChange={changeHandler} autoResize cols={75} />
                {/* <div className="flex justify-content-around" >
                    <div className="flex flex-column"  >
                        <TextInput label={'Signature'} style={{ fontFamily: ['Zeyada', 'cursive'] }} value={'Guna'} />
                    </div>
                    <div className="flex flex-column" >
                        {null}
                    </div>
                </div> */}
                <Flex className={'justify-content-end mt-3 gap-2'} >
                    <Button type='button' severity='secondary' label={'Cancel'} onClick={() => {
                        onHide()
                    }} ></Button>
                    <Button type='button' label={'Submit'} onClick={() => {

                        const postData = {
                            formSubmissionId: self.crypto.randomUUID(),
                            formMetadataId: metaDataId,
                            formDefinitionId: formId,
                            authorDisplayName: name,
                            authorLegalName: name,
                            authorEmail: username,
                            authorId: username,
                            isApproved: true,
                            status: 0,
                            statusText: type === 'APPROVING' ? 'Approved' : 'Rejected',
                            comments: formData.comments,
                            additionalNotes: formData.notes
                        }

                        axiosPost('Form/Approval', postData)
                            .then(res => {
                                showSuccess(res.status)
                            })
                            .catch(err => {
                                // showSuccess(err.toString())
                                alert('error')
                            })

                        console.log(postData)
                        onHide()
                    }} ></Button>
                </Flex>

            </form>

        </>
    )
}

export default ApprovalForm