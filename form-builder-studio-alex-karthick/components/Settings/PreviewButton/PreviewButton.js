import { Button } from "primereact/button"

export default function PreviewButton({ id }) {
  function handlePreview() {   
    const newWindow = window.open(`/form-builder-studio/update/${id}/preview`, "_blank", "resizable,scrollbars,width=800,height=600");
    if (newWindow) {
      newWindow.focus();
    }
  }

  return (
    <>
      <Button label="Preview" style={{ width: "90px" }} onClick={handlePreview} />
    </>
  )
}