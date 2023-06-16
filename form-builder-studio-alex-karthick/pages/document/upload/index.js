
import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from 'primereact/dialog';
// import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip';
import { RadioButton } from "primereact/radiobutton";
import Moment from "moment";
import { InputTextarea } from 'primereact/inputtextarea';
// import { Description } from '@headlessui/react/dist/components/description/description';
import moment from 'moment';
import Bin from '../../../svg/Bin.svg';
import Image from 'next/image';
import { dateFormat } from '../../../utillites/dateFormat';


export default function Home() {
    let baseApi = process.env.NEXT_PUBLIC_DMSBASEAPI;
    // console.log('baseApi :: ', baseApi);
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [filesList, setFilesList] = useState([]);
    const [parentTagList, setParentTagList] = useState([]);
    const [childTagList, setChildTagList] = useState([]);

    const [nsheID, setNsheID] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [stateName, setStateName] = useState('');
    const [src, setSrc] = useState(null);
    const [fileId, setFileID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState();
    const [preview, setPreview] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const [showSave, setShowSave] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    let fileSelected;
    let previewTag;

    const onFileSelect = (e) => {
        console.log('EF Name : ' + e.files[0].name);
        setLoading(true);
        if (parentTag != null && parentTag != undefined && parentTag.name != null) {
            if (childTag != null && childTag != undefined && childTag.name != null) {

                setFileItem(e.files[0]);
                fileSelected = e.files[0];
                setSrc(URL.createObjectURL(e.files[0]));
                uploadInvoice(e.files[0]);
                // setLoading(false);

            } else {
                toast.current.show({ severity: 'info', summary: 'Warning', detail: 'Please Choose Document and then try adding files.' });
                fileUploadRef?.current?.clear();
                setLoading(false);
            }
        } else {
            toast.current.show({ severity: 'info', summary: 'Warning', detail: 'Please Choose Document Type and then try adding files.' });
            fileUploadRef?.current?.clear();
            setLoading(false);

        }
        // console.log('FileRef : ' + fileUploadRef.current.files);
    }


    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
            invoiceUploadHandler(file);
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;
        // uploadButton,
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        // {uploadButton}
        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'end', paddingRight: '0' }}>
                {chooseButton}
                {/* {cancelButton} */}

            </div>
        );
    };

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [metaKey, setMetaKey] = useState(true);

    const [customers, setCustomers] = useState([]);

    const getUploadFiles = (file, props) => {
        const url = URL.createObjectURL(file);
        console.log(file);

        //const docs = ['docx','pdf'];
        //const docType = file.name.split('.')[1];
        //docs.includes(docType) ? pdf.src :

        return (
            <>
                <div style={{ textAlign: 'left', display: 'flex' }} onClick={() => setShow(true)}>
                    {/* <img src={ url} style={{ marginRight: 0 }} width={'40%'} height={'10%'} />  */}
                    <embed style={{ overflow: 'hidden ' }} type=""
                        src={src}
                        width="100"
                        height="100" />
                    <p style={{ paddingLeft: '10px' }}>{file.name}</p>
                    {/* <Button style={{ paddingLeft: "25px", marginRight: '5px' ,marginLeft:'auto',width:"165px",height:'40px',justifyContent:'center'}} label="Add Document" onClick={() => setVisible(true)} />*/}
                    <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" style={{ marginLeft: 'auto' }} onClick={() => onTemplateRemove(file, props.onRemove)} />
                </div>
                {/* <Dialog header="Header" visible={show} style={{ width: '80vw' }} onHide={() => setShow(false)}>
          <Image src={url} alt="Image" width="100%" />
        </Dialog> */}
            </>
        );
    };

    const emptyTemplate = () => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', }}>
                <i className="  mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)', }}></i>
                <span style={{ fontSize: '1em', color: '#104063', fontweight: '500' }} className="my-5">  Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', label: "Add Files", className: 'bgPrimary p-2 border-round' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    const [nodes, setNodes] = useState([]);
    const [checked, setChecked] = useState(false);


    const [date, setDate] = useState(null);

    const [file, setFile] = useState(false);
    const [ingredient, setIngredient] = useState('fileGroup');

    const [selectedCity, setSelectedCity] = useState(null);
    const [parentTag, setParentTag] = useState(null);
    const [childTag, setChildTag] = useState(null);
    const cities = [
        { name: 'IT', code: 'NY' },
        { name: 'ADMIN', code: 'RM' }
    ];

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const header = () => {
        return (
            <div style={{ display: 'flex', padding: '20px' }}>
                <h3 style={{ display: 'flex' }}> Create New </h3>
                <h3 style={{ paddingLeft: '20px' }}>{ingredient}</h3>
                <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center', gap: '5px', paddingLeft: '100px' }}>
                    <RadioButton inputId="ingredient1" name="pizza" value="fileGroup" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'fileGroup'} />
                    <label htmlFor="ingredient1" className="ml-2">File Group</label>
                    <RadioButton inputId="ingredient2" name="pizza" value="file" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'file'} />
                    <label htmlFor="ingredient2" className="ml-2">file</label>
                </div>
            </div>
        )

    }

    const [img, setImg] = useState([]);
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);



    let selectedKey = {};
    let setSelectedKey;
    [selectedKey, setSelectedKey] = useState({});
    const [state, setState] = useState(false)
    const [linkurl, setLinkurl] = useState(null)
    const [linkweb, setLinkWeb] = useState(null);

    useEffect(() => {
        setNsheID('');
        setFirstName('');
        setLastName('');
        setMiddleName('');
        setShowSave(false);
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", "admin");
        urlencoded.append("password", "admin");

        // fetch('http://localhost:8101/docs-web/api/user/login', {
        fetch(baseApi + 'user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded,
            credentials: 'include'
        }).then((response) => {
            // console.log('Response : ' + response);
            response.json().then((token) => {
                // console.log('Token : ' + token.auth_token);
                // authToken = token.auth_token;
                localStorage.setItem('authTok', token.auth_token);
                getFiles();
                getTags();
                setInterval(() => {
                    getFiles();
                }, 30000);
            });
        });

        previewTag = document.querySelector('#preview');
    }, []);

    const getFiles = () => {
        let authToken = localStorage.getItem('authTok');
        let myHeaders = { 'Cookie': 'auth_token=' + authToken }

        document.cookie = "auth_token=" + authToken;

        let docId = localStorage.getItem('docID');
        // fetch(`http://localhost:8101/docs-web/api/file/filelist`,
        fetch(baseApi + `file/filelist`,
            {
                method: 'GET',
                headers: myHeaders,
                // headers: {
                //   'Cookie' : 'auth_token=' + authToken
                // },
                credentials: 'include'
            },
        ).then((response_list) => {

            response_list.json().then((lists) => {
                // console.log('response_list : ', lists.files);
                lists.files?.forEach((res) => res['showModel'] = false)
                setFilesList(lists.files);
                fileUploadRef?.current?.clear();
            });
        });
    };

    const subStringId = (file, index) => {
        let rowNum = index.rowIndex + 1;
        return rowNum;
    };

    const DialogOpen = () => {
        // console.log(linkurl);
        return (
            <Dialog header="View Document" visible={showModel} style={{ width: '80vw' }} onHide={() => {
                // file.showModel = false;
                setShowModel(false);
            }
            }>
                {
                    showModel &&
                    <embed type=""
                        src={linkurl}
                        width="100%"
                        height="550" />
                }
            </Dialog>
        )
    }

    const rowColumnClick = (file) => {
        console.log(file)
        // setTableData(true);
        // let link = `http://localhost:8101/docs-web/api/file/` + file.id + `/data`;
        let link = baseApi + `file/` + file.id + `/data`;
        setLinkurl(link);
        // file.showModel = true;
        setPreview(true);
        // setShowModel(true);
        // return (
        //   <>
        //    {/* <a className='text-whit' href={link} target='_blank'>{file.name}</a> */}
        //    {/* <p className='text-whit' onClick={() => setTableData(true)}>{file.name}</p> */}
        //    {/* <Dialog header="Header" visible={tableData} style={{ width: '80vw' }} onHide={() => setTableData(false)}> */}
        //     {/* <p>Hi</p> */}
        //   {/* <iframe src={objURL} style="width:600px; height:500px;" frameborder="0"></iframe> */}
        //     {/* </Dialog>  */}
        //     <Dialog header="Header" visible={file.showModel} style={{ width: '80vw' }} onHide={() => file.showModel = false}>
        //       {/* <Image src={url} alt="Image" width="100%" /> */}
        //        <embed type=""
        //    src={link} 
        //    width="1250"
        //       height="1500"/>
        //     {/* <p>haii</p> */}
        //     </Dialog>
        // </>
        // )
    }

    const viewIndex = (file, index) => {
        let indexes = index.rowIndex + 1;
        // onClick={() => viewTagsName(file)}
        return (
            <>
                <span style={{ cursor: 'pointer' }} autoFocus>
                    {indexes}
                </span>
            </>
        )
    };

    const viewAction = (file) => {
        return (
            <>
                <Image src={Bin} style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={() => {
                    // (file)
                    deleteClick(file);
                }
                } autoFocus />
            </>
        )
    };

    const deleteClick = (file) => {

        if (fileId != null && fileId != undefined && fileId != '') {
            let authToken = localStorage.getItem('authTok');
            // let myHeaders = { 'Cookie': 'auth_token=' + authToken }
            let myHeaders1 = {
                'Cookie': 'auth_token=' + authToken,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/x-www-form-urlencoded;'
            }
            document.cookie = "auth_token=" + authToken;

            // let docURL = 'http://localhost:8101/docs-web/api/file/' + fileId;
            let docURL = baseApi + 'file/' + fileId;

            fetch(docURL,
                {
                    method: 'DELETE',
                    headers: myHeaders1,
                    credentials: 'include'
                },
            ).then((response_1) => {
                // console.log('Delete_Res : ' + response_1);
                response_1.json().then((resp) => {
                    console.log('Delete_ID : ' + resp);
                    toast.current.show({ severity: 'error', summary: 'Info', detail: 'Document Deleted Successfully.!' });
                    setTitle('');
                    setValue('');
                    setNsheID('');
                    setFirstName('');
                    setLastName('');
                    setMiddleName('');
                    setStateName('');
                    setShowModel(false);
                    setShowSave(false);
                    setPreview(false);
                    getFiles();
                })
            })

        } else {
            toast.current.show({ severity: 'info', summary: 'Warning', detail: 'Please select a Document to Delete.' });
        }
    }

    const saveInvoice = () => {

        if (fileId != null && fileId != undefined && fileId != '') {
            if (nsheID != null && nsheID != undefined && nsheID != '' && firstName != null && firstName != undefined && firstName != '' &&
                middleName != null && middleName != undefined && middleName != '' && lastName != null && lastName != undefined && lastName != '' &&
                stateName != null && stateName != undefined && stateName != '') {

                // setFileItem(e.files[0]);
                // fileSelected = e.files[0];
                // setSrc(URL.createObjectURL(e.files[0]));
                // uploadInvoice(e.files[0]);
                let authToken = localStorage.getItem('authTok');
                // let myHeaders = { 'Cookie': 'auth_token=' + authToken }
                let myHeaders1 = {
                    'Cookie': 'auth_token=' + authToken,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/x-www-form-urlencoded;'
                }
                document.cookie = "auth_token=" + authToken;

                // let docURL = 'http://localhost:8101/docs-web/api/file/' + fileId + '/persist';
                let docURL = baseApi + 'file/' + fileId + '/persist';

                var urlencoded = new URLSearchParams();
                urlencoded.append("saved", true);
                urlencoded.append("firstName", firstName);
                urlencoded.append("middleName", middleName);
                urlencoded.append("lastName", lastName);
                urlencoded.append("idNumber", nsheID);
                urlencoded.append("idRegion", stateName);

                // let formData = new FormData();
                // formData.append('saved', true);
                // formData.append('firstName', firstName);
                // formData.append('middleName', middleName);
                // formData.append('lastName', lastName);
                // formData.append('idNumber', nsheID);
                // formData.append('idRegion', stateName);
                fetch(docURL,
                    {
                        method: 'POST',
                        headers: myHeaders1,
                        body: urlencoded,
                        credentials: 'include'
                    },
                ).then((response_1) => {
                    console.log('Response_Save : ' + response_1);
                    response_1.json().then((resp) => {
                        console.log('Save_ID : ' + resp);
                        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Document Tags Saved Successfully.!' });
                        // setFilesList([]);
                        setTitle('');
                        setValue('');
                        setNsheID('');
                        setFirstName('');
                        setLastName('');
                        setMiddleName('');
                        setStateName('');
                        setShowModel(false);
                        setShowSave(false);
                        setPreview(false);
                        getFiles();
                    })
                })

            } else {
                toast.current.show({ severity: 'info', summary: 'Warning', detail: 'Please make sure all the tag fields are filled.' });
            }
        } else {
            toast.current.show({ severity: 'info', summary: 'Warning', detail: 'Please select a Document to Save.' });
        }

    }

    const viewTagsName = (file) => {

        console.log('ID: ', file.idNumber);
        setFileID(file.id);
        console.log('ID : ', file.id);
        setNsheID(file.idNumber);
        setFirstName(file.firstName);
        setLastName(file.lastName);
        setMiddleName(file.middleName);
        setStateName(file.idRegion);
        setShowSave(true);
        // let link = `http://localhost:8101/docs-web/api/file/` + file.id + `/data`;
        // let link_Web = `http://localhost:8101/docs-web/api/file/` + file.id + `/data?size=web`;
        let link = baseApi + `file/` + file.id + `/data`;
        let link_Web = baseApi + `file/` + file.id + `/data?size=web`;
        setLinkurl(link);
        setLinkWeb(link_Web);
        setPreview(true);

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

    // const convertDate = (file) => {
    //   return Moment(file.create_date).format('MM/DD/YY hh:mm');
    // }

    const convertDate = (file) => {
        return dateFormat(file.create_date);
    }

    const getTags = () => {
        let authToken = localStorage.getItem('authTok');
        let myHeaders = { 'Access-Control-Allow-Credentials': true, 'Cookie': 'auth_token=' + authToken }

        document.cookie = "auth_token=" + authToken;

        // fetch(`http://localhost:8101/docs-web/api/tag/list`,
        fetch(baseApi + `tag/list`,
            // orders/${orderId}/uploadInvoiceFile
            {
                method: 'GET',
                headers: myHeaders,
                // headers: {
                //   'Cookie' : 'auth_token=' + authToken
                // },
                credentials: 'include'
            },
        ).then((response2) => {
            // console.log('response 1 : ' + response);
            console.log('response 2 : ' + response2.json().then((token) => {
                console.log('_2 : ', token.tags);
                // setParentTagList();
                // setChildTagList();

                // console.log(token.tags.filter(val =>  val.find( item => item.parent != undefined && item.parent != null ))); 
                // console.log(token.tags.filter((e) => e.parent !== undefined && e.parent !== null));
                setChildTagList(token?.tags?.filter((e) => e.parent !== undefined && e.parent !== null));
                setParentTagList(token?.tags?.filter((e) => e.parent == undefined || e.parent == null));
                // const tagList = token.tags;
                // const filtered1 = tagList.filter(item =>
                //   item.filter(c => c.parent != undefined && c.parent != null)
                // );

                // const filtered2 = tagList.filter(item =>
                //   item.filter(c => c.parent == undefined || c.parent == null)
                // );

            }));

        });

        // setFilesList(response1.files);
    };

    const invoiceUploadHandler = ({ files }) => {
        setNsheID('');
        setFirstName('');
        setLastName('');
        setMiddleName('');
        const [file] = files;
        const fileReader = new FileReader();
        // console.log('files.name : ', files[0].name);
        fileReader.onload = (e) => {
            // uploadInvoice(e.target.result, files[0]);
            uploadInvoice();
        };
        fileReader.readAsDataURL(file);
    };

    // const uploadInvoice = async (invoiceFile, file) => {
    const uploadInvoice = async (file) => {
        let authToken = localStorage.getItem('authTok');
        let myHeaders = { 'Cookie': 'auth_token=' + authToken }
        let myHeaders1 = { 'Cookie': 'auth_token=' + authToken, 'Content-Type': 'application/x-www-form-urlencoded' }
        document.cookie = "auth_token=" + authToken;
        // let updatedTime = moment().format('LTS');
        let updatedTime = new Date().getTime();
        setTitle(childTag.name + ' - ' + file.name);
        let docTitle = childTag.name + ' - ' + file.name;
        console.log('Title : ' + docTitle + ' : ' + title);
        // fileItem.name = docTitle;


        // let docURL = 'http://localhost:8101/docs-web/api/document?create_date=' + updatedTime + '&description=' + value + ''
        //   + '&language=eng&tags=' + childTag?.id + '&title=' + docTitle;
        let docURL = baseApi + 'document?create_date=' + updatedTime + '&description=' + value + ''
            + '&language=eng&tags=' + childTag?.id + '&title=' + docTitle;
        fetch(docURL,
            {
                method: 'PUT',
                headers: myHeaders1,
                credentials: 'include'
            },
        ).then((response_1) => {
            console.log('Response_Doc : ' + response_1);
            response_1.json().then((resp) => {
                console.log('DOC_ID : ' + resp.id);
                localStorage.setItem('docID', resp.id);

                let formData = new FormData();
                formData.append('file', file);
                // formData.append('name', file.name);
                formData.append('id', resp.id);
                // console.log('FName : ' + file.name);

                // fetch(`http://localhost:8101/docs-web/api/file`,
                fetch(baseApi + `file`,
                    {
                        method: 'PUT',
                        body: formData,
                        headers: myHeaders,
                        credentials: 'include'
                    },
                ).then((respon_2) => {
                    getFiles();
                    // respon_2.json().then((resp) => {
                    //   console.log('Name : ' + resp.name);
                    //   setTitle(childTag.name + ' - ' + resp.name);
                    // })
                    setLoading(false);
                    toast.current.show({ severity: 'info', summary: 'Info', detail: 'Document ' + title + ' Saved Successfully.!' });
                })
            });
        });

    };

    const [fileItem, setFileItem] = useState('');

    const handleUpdate = () => {
        let authToken = localStorage.getItem('authTok');
        let myHeaders = { 'Cookie': 'auth_token=' + authToken }

        // document.cookie = "auth_token=" + authToken;
        // // parentTag,    childTag, cities,  value
    }

    const gridColumns = [
        { field: '', header: 'Sl.No' },
        { field: 'name', header: 'File Name' },
        { field: 'size', header: 'File Size' },
        { field: 'create_date', header: 'Created' },
        { field: 'mimetype', header: 'File Type' }
    ];

    // console.log('filesList : ' + filesList);
    // ===========================================================

    return (
        <>
            <Toast ref={toast} />
            {/* <NavLink to={'/'} /> */}
            {

                <>
                    {/* <div style={{ marginTop: '20px' }}>
            <div className=" flex-wrap justify-content-center  ">
              <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText placeholder=" Quick Search " />
              </span>
            </div>
          </div> */}
                    <div style={{ backgroundColor: "#f6f7f9", marginTop: '8px', overflow: 'hidden', marginLeft: '-7px', width: '100%' }}>
                        <p className="m-0">
                            <div style={{ display: 'flex', padding: '0px' }}>


                                {/*<div style={{gap:'20px',display:'flex'}}>
 <Button label="Department"onClick={() => setVisible(true)} icon="pi pi-angle-up" iconPos="right" style={{height:'50px',marginLeft:'800px',backgroundColor:'#00b9ff',borderColor:'Background',marginBottom:'10px'}} />
 <div className=" flex-wrap justify-content-center ">
 <span className="p-input-icon-right">
      <i className="pi pi-search" />
      <InputText placeholder="Search Forms" />
  </span>
  </div>
  </div>*/}
                            </div>
                        </p>
                        <div className="grid justify-content-start">
                            <div className={""} style={{ display: 'flex', gap: '20px', marginLeft: '2px', marginTop: '8px', width: '20%' }}>

                                <Card className={'card justify-content-center'} title="" style={{ backgroundColor: '#eff2f6', alignItems: 'center' }}>

                                    <div className={'card pt-0'} style={{ paddingLeft: '8px' }}>
                                        <div className={'field pt-0'} style={{ marginBottom: '24px', paddingLeft: '4px' }}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '3px', color: '#104063', fontSize: '14px' }}>Department</p>
                                            <p style={{ marginTop: '0px', fontSize: '0.9em', color: '#09547f ', paddingLeft: '2px' }}>
                                                <InputText value="Academic Affairs" placeholder="" readOnly />
                                            </p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>Document Type </p>
                                            <p style={{ marginTop: '0px', paddingLeft: '4px', fontSize: '0.8em' }}>
                                                <Dropdown value={parentTag} onChange={(e) => setParentTag(e.value)} options={parentTagList} optionLabel="name"
                                                    placeholder="" className="w-full md:w-14rem" style={{ height: '35px', alignItems: 'center', justifyContent: 'center' }} /></p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>Document</p>
                                            <p style={{ marginTop: '0px', paddingLeft: '4px', fontSize: '0.8em' }}>
                                                {/* <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                          placeholder="" className="w-full md:w-14rem" style={{ height: '35px', alignItems: 'center', justifyContent: 'center', width: '210px' }} /> </p> */}
                                                < Dropdown value={childTag} onChange={(e) => { setChildTag(e.value); console.log('child : ' + e.value.id) }} options={childTagList} optionLabel="name"
                                                    placeholder="" className="w-full md:w-14rem" style={{ height: '35px', alignItems: 'center', justifyContent: 'center' }} /> </p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>Document Title</p>
                                            <p style={{ marginTop: '0px', width: '20px', paddingLeft: '4px', fontSize: '0.9em' }}>
                                                <InputText value={title} tooltip="string" placeholder="" onChange={(e) => setTitle(e.target.value)} />
                                            </p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>Document Description</p>
                                            <p style={{ marginTop: '0px', width: '20px', paddingLeft: '4px', fontSize: '0.9em' }}>
                                                <InputTextarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} cols={30} />
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', paddingLeft: '10px', marginTop: '10px', color: '#104063' }}>
                                        <h3>Tags</h3>
                                        {/* <Button label='Reset' icon='pi pi-pencil' onClick={() => handleReset()} autoFocus /> */}
                                        {/* <Button visible={!showSave} style={{ height: 'fit-content', backgroundColor: '#024F7C', marginLeft: '140px', borderColor: 'none', marginTop: '10px', position: 'absolute' }} label='Upload' onClick={() => uploadInvoice()} autoFocus /> */}
                                        <Button visible={showSave} style={{ height: 'fit-content', backgroundColor: '#024F7C', marginLeft: '150px', borderColor: 'none', marginTop: '10px', position: 'absolute' }}
                                            label='Save' onClick={() => saveInvoice()} autoFocus />
                                    </div>

                                    <div className={'card'} style={{ paddingLeft: '8px' }}>
                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}> Document ID</p>
                                            <p style={{ marginTop: '0px', paddingLeft: '4px', fontSize: '14px' }}>
                                                <InputText value={nsheID} className={fileId != null && fileId != undefined && fileId != '' && nsheID == '' ? "tagInputError" : "tagInput"} placeholder=""
                                                    onChange={(e) => setNsheID(e.target.value)} /></p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>First Name</p>
                                            <p style={{ marginTop: '0px', paddingLeft: '4px', fontSize: '14px' }}>
                                                <InputText value={firstName} className={fileId != null && fileId != undefined && fileId != '' && firstName == '' ? "tagInputError" : "tagInput"} placeholder=""
                                                    onChange={(e) => setFirstName(e.target.value)} /> </p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>Last Name</p>
                                            <p style={{ marginTop: '0px', paddingLeft: '4px', fontSize: '0.9em' }}>
                                                <InputText value={lastName} className={fileId != null && fileId != undefined && fileId != '' && lastName == '' ? "tagInputError" : "tagInput"} placeholder=""
                                                    onChange={(e) => setLastName(e.target.value)} /> </p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>Middle Name</p>
                                            <p style={{ marginTop: '0px', paddingLeft: '4px', fontSize: '0.9em' }}>
                                                <InputText value={middleName} className={fileId != null && fileId != undefined && fileId != '' && middleName == '' ? "tagInputError" : "tagInput"} placeholder=""
                                                    onChange={(e) => setMiddleName(e.target.value)} />  </p>
                                        </div>

                                        <div className={'field'}>
                                            <p style={{ fontWeight: 600, marginBottom: '2px', paddingLeft: '4px', color: '#104063', fontSize: '14px' }}>State</p>
                                            <p style={{ marginTop: '0px', paddingLeft: '4px', fontSize: '0.9em' }}>
                                                <InputText value={stateName} className={fileId != null && fileId != undefined && fileId != '' && stateName == '' ? "tagInputError" : "tagInput"} placeholder=""
                                                    onChange={(e) => setStateName(e.target.value)} /> </p>
                                        </div>
                                    </div>
                                </Card>


                            </div>
                            <div className='' style={{ display: 'flex', flexDirection: 'column', columnGap: '20px', width: '42%', marginLeft: '57px' }}>
                                {/* <Card className="card" title=" Document view" style={{ backgroundColor: '#f7f5ed',width:'75%'}}>
   
</Card> */}

                                <Card className="card pt-0" style={{ backgroundColor: '#E5F8FF', width: '100%', marginTop: '32px', borderRadius: '16px', marginLeft: '-14px', boxshadow: 'none', height: '38%' }}>
                                    <div className='pt-0' style={{ margintop: ' 50px', marginleft: '10px', borderradius: '16px', color: '#104063' }}>
                                        <h3 className='pt-0 mt-0'>Upload from Computer</h3>
                                        <Toast ref={toast}></Toast>

                                        {/* <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" /> */}
                                        {/* <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />   */}
                                        <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                                        {/* <FileUpload ref={fileUploadRef} name="demo[]" multiple webkitdirectory maxFileSize={1000000}
                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                    headerTemplate={headerTemplate} itemTemplate={getUploadFiles} emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} 
                    uploadHandler={invoiceUploadHandler}
                    /> */}




                                        <FileUpload name="demo[]" ref={fileUploadRef} webkitdiretory="true" maxFileSize={1000000} itemTemplate={getUploadFiles}
                                            headerTemplate={headerTemplate} chooseOptions={chooseOptions}
                                            cancelOptions={cancelOptions} emptyTemplate={emptyTemplate} customUpload={true}
                                            onSelect={onFileSelect} onUpload={onTemplateUpload} uploadOptions={uploadOptions}
                                            onError={onTemplateClear} onClear={onTemplateClear}
                                        />
                                        {loading &&
                                            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        }
                                        {/* uploadHandler={invoiceUploadHandler}  */}
                                        {/* <Button label="Add Files" style={{ marginLeft: '0px', marginTop: '15px', backgroundColor: '#024F7C', position: 'relative', float: 'right' }} /> */}
                                        {/* <Toast ref={toast}></Toast>
            <FileUpload mode="basic" name="demo[]"  style={{marginLeft:'500px',marginTop:'15px',backgroundColor: '#024F7C'}} 
         ref={fileUploadRef} webkitdirectory  maxFileSize={1000000} onUpload={onUpload} auto chooseLabel="Add Files"  /> */}

                                    </div>
                                </Card>
                                {/* selector: "id",
  sortable: true,
  headerStyle: (selector, id) => {
    return { width: "80px", textAlign: "center" };
  }, */}

                                <Card className="card" title="Document Details" style={{ width: '100%', marginBottom: '25px', height: '440px', marginTop: '23px', borderRadius: '16px', marginLeft: '-14px', color: '#104063' }}>
                                    {/* <span className='pi pi-refresh px-3 pb-6' style={{ display: 'table', cursor: 'pointer', marginLeft: 'auto',marginTop:'-46px' }} onClick={() => getFiles()} autoFocus /> */}
                                    {filesList != undefined && filesList != null && filesList.length > 0 ?

                                        <DataTable value={filesList} scrollable scrollHeight="300px" size="small" stripedRows
                                            tableStyle={{ overflow: 'scroll', minWidth: '40rem', backgroundColor: '#024F7C', fontSize: '14px' }}
                                            selectionMode="single" selection={selectedProduct} onSelectionChange={(e) => { setSelectedProduct(e.value); viewTagsName(e.value) }} dataKey="id"
                                            metaKeySelection={metaKey}>
                                            <Column body={viewIndex} header=" File ID" style={{ border: 'none', width: '8%' }}></Column>
                                            <Column field="name" header="File Name" style={{ border: 'none', width: '25%' }} ></Column>
                                            <Column field="mimetype" header="File Type" style={{ border: 'none', width: '10%' }}></Column>
                                            <Column body={sizeConstructor} header="Size " style={{ border: 'none', width: '10%' }}></Column>
                                            <Column body={convertDate} header="Scan Date " headerStyle={{ width: '27%' }} style={{ border: 'none' }}></Column>
                                            <Column body={(e) => e.processing ? <div class="lds-dual-ring"></div> : 'Indexed'} header="Status" style={{ border: 'none', width: '10%' }}></Column>
                                            <Column body={viewAction} header="" style={{ border: 'none', width: '10%' }}></Column>
                                            {/* <Column field="inventoryStatus"     header="Status"  style={{border:'none'}}></Column> */}

                                            {/* {gridColumns.map((col, i) => {
          <Column key={col.field} field={col.field} header={col.header} />
                })} */}
                                        </DataTable > : <span>No Data</span>
                                    }
                                </Card >



                            </div >
                            <div className={'mb-4 bg-white justify-content-start '} style={{ borderRadius: '16px', marginTop: '32px', marginRight: '10px', marginLeft: '4px', color: '#104063', width: '32%' }}>
                                <h3 className={'ml-3'} >Document Preview
                                    {/* <i className="pi pi-eye ml-3" style={{ cursor: 'pointer', marginleft: '16px', marginRight: '1px' }} onClick={() => {
                    setShowModel(true);
                  }} autoFocus /> */}
                                </h3>

                                {/* <object height="100%" width="100%" type="application/pdf" data="yii.pdf#toolbar=1&amp;navpanes=0&amp;scrollbar=1&amp;page=1&amp;view=FitH"> */}
                                <div className={'px-3 py-2'}>

                                    {preview ? <>
                                        <div >
                                            <object height="100%" width="100%" type="image/jpeg" data={linkweb} onClick={() => {
                                                console.log('Clicked');
                                                setShowModel(true);
                                            }} />
                                            {/* <embed type=""
                        id="preview" onClick={(e) => {
                          previewTag?.onClick(() => {
                            console.log('Clicked'); setShowModel(true);
                          }, true)
                        }}
                        src={linkurl}
                        width="100%"
                        height="550" /> */}
                                        </div>
                                    </> :
                                        <></>}
                                    {/* preview && */}
                                </div>

                            </div>
                        </div >
                    </div >
                    <DialogOpen />
                </>
            }
        </>

    )
}