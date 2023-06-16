import { Card } from "primereact/card"
import { Button } from "primereact/button"
import Flex from "../../components/Layout/Flex"
import Header from "../../components/Header/Header"
import TextInput from "../../components/Input/TextInput"
import { useRouter } from "next/router"

import form1 from '../../svg/form1.svg';
import batch1 from '../../svg/batch1.svg';
import Image from 'next/image';


export default function Home() {

    const router = useRouter()
    console.log(form1)

    return (
        <>
            <div className="card flex justify-content-center">


            </div>
            <Flex direction={'column'} className={'my-4 h-full w-full bg-white justify-content-start border-round'} >
                <Flex className={'px-3 py-2'} >
                    <Header size={2}>Document</Header>
                </Flex>
                <Flex direction={'column'} className={'justify-content-between align-items-center h-30rem '} >
                    <Header size={2} className={'text-left text-primary'} >Would You Like To...</Header>
                    <Image src={form1} height={550} width={550} onClick={() => {
                        router.push('document/upload')
                    }} ></Image>
                    <Image src={batch1} height={550} width={550} />
                </Flex>
            </Flex>



        </>
    )
}