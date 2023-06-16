import { Card } from "primereact/card";
import Header from "../../components/Header/Header";
import Flex from "../../components/Layout/Flex";

export default function Dashboard() {

    return (
        <>
            <Flex direction={'column'} className={'h-full'} >
                <Header size={2} >Dashboard</Header>
                <Flex className={'h-full bg-white justify-content-center align-items-center'}>
                    <Header size={2} className={'text-500'}>Processing...</Header>
                </Flex>
            </Flex>
        </>
    )
}