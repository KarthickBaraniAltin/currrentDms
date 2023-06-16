import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useState } from "react";
import { useRouter } from "next/router";
import TextInput from "../../Input/TextInput";
import { FilterMatchMode } from 'primereact/api';


export default function Datagrid({ data, columns, header, customColumn, loading, paginator = false, rows }) {

    const router = useRouter()
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    }



    // const header = () => {
    //     return (
    //         <div className="flex justify-content-between align-items-center">
    //             <span className="text-xl text-900 font-bold">{caption}</span>
    //             <span className="p-input-icon-left">
    //                 <i className="pi pi-search" />
    //                 <TextInput value={globalFilterValue} onChange={onGlobalFilterChange} label="Search here" />
    //             </span>
    //         </div>
    //     )
    // }

    const Currentcolumn = (columns) => {
        const cols = columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} body={col.body} sortable={col.sortable} />
        ))
        {
            customColumn ?
                cols.push(<Column body={customColumn} header={'Action'} />)
                :
                null
        }

        return cols
    }

    return (
        <DataTable loading={loading} value={data} tableStyle={{ minWidth: '50rem' }} header={header} filters={filters} globalFilterFields={columns.map(col => col.field)} paginator={paginator} rows={rows} >
            {Currentcolumn(columns)}
        </DataTable>
    )
}