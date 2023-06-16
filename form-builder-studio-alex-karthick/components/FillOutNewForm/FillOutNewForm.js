import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";
import { useApi } from "../../hooks/useApi";

export default function FillOutNewForm({ isButtonClicked, setIsButtonClicked, formDefinition, lazyNewForms, setLazyNewForms, selectedFormDefinition, setSelectedFormDefinition, newFormsTotalRecords, loading }) {
  const router = useRouter()
  // const { loading } = useApi()
  
  const toViewPage = (id) => {
      router.push(`/view/${id}`);
  }

  const onNewFormsPage = (event) => {
    setLazyNewForms(event)
  }
  
  return (
      <>
          {isButtonClicked && 
          <Dialog visible={isButtonClicked} onHide={() => setIsButtonClicked(false)}>
            <h3>Available Forms</h3>
            <DataTable 
              value={formDefinition} lazy paginator first={lazyNewForms.first} rows={lazyNewForms.rows} 
              totalRecords={newFormsTotalRecords} onPage={onNewFormsPage}
              tableStyle={{ minWidth: '50rem' }} loading={loading} sortOrder={lazyNewForms.sortOrder}
              selectionMode="single" selection={selectedFormDefinition} metaKeySelection={false}
              onSelectionChange={(e) => {
                setSelectedFormDefinition(e.value)
                toViewPage(e.value.id)
              }}
            >
              <Column field="formId" header="Form ID"></Column>
              <Column field="name" header="Name"></Column>
              <Column field="description" header="Description"></Column>
            </DataTable>
          </Dialog>
          }
      </>
  )
}