import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
// import Header from "../../components/header/Header";
import Flex from '../../../components/Layout/Flex';
import Header from '../../../components/Header/Header';
// import Flex from "../../components/Layout/Flex";
import { InputText } from "primereact/inputtext";
// import Datagrid from "../../components/WorkflowNode/Datagrid/Datagrid";
import Datagrid from '../../../components/WorkflowNode/Datagrid/Datagrid';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from 'primereact/dialog';
import Moment from "moment";


export default function AdvancedDemo() {
    let baseApi = process.env.NEXT_PUBLIC_DMSBASEAPI;
    // console.log('baseApi : ', baseApi);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [metaKey, setMetaKey] = useState(true);

    const [value, setValue] = useState('');
    const [filesList, setFilesList] = useState([]);
    const [filterArray, setFilterArray] = useState([]);

    useEffect(() => {
        getFiles();
    }, [])

    const getFiles = () => {
        let authToken = localStorage.getItem('authTok');
        let myHeaders = { 'Cookie': 'auth_token=' + authToken }

        document.cookie = "auth_token=" + authToken;

        // fetch(`http://localhost:8101/docs-web/api/file/taglist?tagId=` + null,
        fetch(baseApi + `file/taglist?tagId=` + null,
            // orders/${orderId}/uploadInvoiceFile
            {
                method: 'GET',
                headers: myHeaders,
                // headers: {
                //   'Cookie' : 'auth_token=' + authToken
                // },
                credentials: 'include'
            },
        ).then((response1) => {
            // console.log('response 1 : ' + response);
            console.log('response 1 : ' + response1.json().then((token) => {
                console.log('_1 : ', token.files);
                setFilesList(token.files);
                setFilterArray(token.files);
            })
            )
        })
    }

    const saveClick = () => {

    }

    const gridColumns = [
        { field: 'name', header: 'File Name' },
        { field: 'size', header: 'File Size' },
        { field: 'create_date', header: 'Created' },
        { field: 'mimetype', header: 'File Type' },
        { field: 'processing', header: 'Status' },

    ];

    const footer = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button label="Search" icon="pi pi-check" onClick={() => saveClick()} />
            <Button label="Clear" icon="pi pi-times" onClick={() => setValue('')} className="p-button-outlined p-button-secondary" />
        </div>
    );

    const subStringId = (file, index) => {
        let rowNum = index.rowIndex + 1;
        return rowNum;
    };

    const fileNameAction = (file) => {

        // let link = `http://localhost:8101/docs-web/api/file/` + file.id + `/data`;
        let link = baseApi + `file/` + file.id + `/data`;
        console.log('F_ID : ' + file.id);
        // const objURL = URL.createObjectURL(file);
        return (
            <>
                <div>
                    <a onClick={() => rowColumnClick(file)}>{file.name}</a>
                    {/* <p className='text-whit' onClick={() => setTableData(true)}>{file.name}</p> */}
                    {/* <Dialog header="Header" visible={file.showModel} style={{ width: '80vw' }} onHide={() => file.showModel = false}> */}
                    <Dialog header="Header" visible={file.showModel && showModel} style={{ width: '80vw' }} onHide={() => setShowModel(false)}>
                        <embed type=""
                            src={link}
                            width="1250"
                            height="1500" />

                    </Dialog>
                </div>
            </>
        )
    };

    const rowColumnClick = (file) => {
        console.log(file)
        // setTableData(true);
        // let link = `http://localhost:8101/docs-web/api/file/` + file.id + `/data`;
        let link = baseApi + `file/` + file.id + `/data`;
        setLinkurl(link);
        file.showModel = true;
        setShowModel(true);
    };

    const sizeConstructor = (file) => {
        let bytes = file.size;
        var marker = 1024; // Change to 1000 if required
        var decimal = 0; // Change as required
        var kiloBytes = marker; // One Kilobyte is 1024 bytes
        var megaBytes = marker * marker; // One MB is 1024 KB
        var gigaBytes = marker * marker * marker; // One GB is 1024 MB
        var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

        // return bytes if less than a KB
        if (bytes < kiloBytes) return bytes + " Bytes";
        // return KB if less than a MB
        else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
        // return MB if less than a GB
        else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
        // return GB if less than a TB
        else return (bytes / gigaBytes).toFixed(decimal) + " GB";
    }

    const convertDate = (file) => {
        return Moment(file.create_date).format('MM/DD/YY hh:mm');
    }

    return (
        <div className="my-4 w-full h-full" >
            <Flex direction={'column'} className={'my-4 h-full w-full bg-white justify-content-start border-round'} >
                <Flex direction={'column'} className={'justify-content-between align-items-center h-30rem '} >
                    {/* <Datagrid data={filesList} columns={gridColumns} sortable={true} /> */}

                    {filesList != undefined && filesList != null && filesList.length > 0 ?
                        <DataTable value={filesList} scrollable scrollHeight="300px" size="small" stripedRows
                            tableStyle={{ overflow: 'scroll', minWidth: "30rem", backgroundColor: '#f7f5ed' }}
                            selectionMode="single" selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)}
                            dataKey="id" metaKeySelection={metaKey}>
                            <Column body={subStringId} header="ID" style={{ border: 'none', width: '25px' }}></Column>
                            <Column body={fileNameAction} header="File Name" style={{ border: 'none', width: '160px' }}></Column>
                            {/* <Column body={viewAction} header="File Type" style={{ border: 'none', width: '100px' }}></Column> */}
                            <Column field="mimetype" header="File Type" style={{ border: 'none', width: '100px' }}></Column>
                            <Column body={sizeConstructor} header="Size " style={{ border: 'none', width: '60px' }}></Column>
                            <Column body={convertDate} header="Created Date " style={{ border: 'none', width: '120px' }}></Column>
                            <Column body={(e) => e.processing ? 'Awaiting Index' : 'Indexed'} header="Status" style={{ border: 'none' }}></Column>
                        </DataTable> : <p>No Data</p>}

                    {/* <Flex className={'h-full justify-content-center align-items-center'}>
                    <div className="card flex justify-content-center ">
                        <Card title="" subTitle="Subtitle" footer={footer} className="md:w-25rem " style={{ marginTop: '50px', backgroundColor: '#eaf5fa' }}>
                            <InputText value={value} onChange={(e) => setValue(e.target.value)} />
                        </Card>
                    </div>
                </Flex>  */}

                </Flex>
            </Flex>
        </div>
    )

}