import { Button } from "primereact/button"
import { createElement } from "react"
import Header from "src/Compound/Header/Header"
import { TextInput } from "src/Compound/Input/TextInput"
import Flex from "src/Compound/Layout/Flex"

function RejectForm() {

    return (
        <>
            <form >
                <Flex direction={'column'} className={'gap-2'} >
                    <Header size={1} ><small> You are REJECTING this form</small></Header>
                    <Header size={3} >Review :</Header>
                    <TextInput label={'Reason unable to use Clearinghouse'} />
                    <TextInput label={'Additional notes'} />
                    <Flex className={'justify-content-around'} >
                        <Flex direction={'column'} >
                            <label>Received by:</label>
                            <Header size={5} >Guna</Header>
                            <Header size={5} >Peter</Header>
                            <Header size={5} >chandra</Header>
                        </Flex>
                        <Flex direction={'column'}>
                            <label>Date Received:</label>
                            <Header size={4} >3/16/23</Header>
                        </Flex>
                    </Flex>
                    <Flex className={'justify-content-around'} >
                        <Flex direction={'column'} >
                            <label>Date send:</label>
                            <Header size={5} >TBD</Header>
                        </Flex>
                        <Flex direction={'column'}>
                            <label>By:</label>
                            <Header size={4} >3/16/23</Header>
                        </Flex>
                    </Flex>
                    <Flex className={'justify-content-around'} >
                        <Flex direction={'column'} >
                            <TextInput label={'Signature'} style={{ fontFamily: 'Zeyada' }} value={'Guna'} />
                        </Flex>
                        <Flex direction={'column'}>
                            {null}
                        </Flex>
                    </Flex>
                    <Flex className={'justify-content-around'} >
                        <Button label={'Cancel'} ></Button>
                        <Button label={'Submit'} ></Button>
                    </Flex>
                </Flex>
            </form>
        </>
    )
}

export default RejectForm