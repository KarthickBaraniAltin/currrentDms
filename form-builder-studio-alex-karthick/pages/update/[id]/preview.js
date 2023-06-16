import { getFormDefinition } from "../../../api/apiCalls";
import { useConvertFormSubmission } from "../../../hooks/useConvertFormSubmission";
import { useInputs } from "../../../hooks/useInput";
import { useValidation } from "../../../hooks/useValidation";
import { useCondition } from "../../../hooks/useCondition";
import ViewComponents from "../../../components/ViewComponents/ViewComponents/ViewComponents";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function PreviewPage({ id, metadata, initialValues, footer, formDefinitionData }) {
  const { convertData } = useConvertFormSubmission()
  const convertedData = convertData(initialValues)
  const { inputs, files, handleInputChange, assignValuesNested } = useInputs({ initialValues: convertedData })
  const { errors, validationMapper } = useValidation({ metadata, inputs, files, authorName: formDefinitionData.authorDisplayName })
  const { conditionMapper, conditions } = useCondition({ validationMapper })

  return (
    <div className="flex justify-content-center align-items-center"> {/* className="flex flex-column align-items-center" style={{height: "100vh"}} */ }
      <Card className='card form-horizontal mt-5' style={{'width': '70%'}}>
        <ViewComponents
          metadata={metadata}
          conditions={conditions}
          conditionMapper={conditionMapper}
          validationMapper={validationMapper}
          inputs={inputs}
          handleInputChange={handleInputChange}
          errors={errors}
          assignValuesNested={assignValuesNested}
        />
        {/* <Button label="Refresh"  onClick={() => window.location.reload()} /> */}
        <div className="flex justify-content-end mt-1">
          <label>{footer}</label>
        </div>
      </Card>
      <Button label="Refresh" className="align-self-start"  onClick={() => window.location.reload()} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await getFormDefinition(id)

    const initialValues = {}
    if (res.data?.metadata?.metadata) {
      const metadata = res.data.metadata.metadata;
      Object.keys(metadata).forEach((key) => {
        const element = metadata[key];
        if (element.defaultValue) {
          initialValues[element.name] = element.defaultValue;
        }
      });
    }

    return {
      props: {
        id,
        metadata: res.data.metadata.metadata,
        footer: res.data.footer,
        initialValues,
        formDefinitionData: res.data
      }
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        data: []
      }
    }
  }
}