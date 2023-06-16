import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import Condition from './Condition/Condition'

export default function ConditionDialog({ metadata, conditions, setConditions, conditionMapper, addCondition, deleteCondition }) {
    const [showDialog, setShowDialog] = useState(false)

    const handleStatus = () => {
        setShowDialog(prevState => !prevState)
    }
    
    return (
        <>
            <Button label='Conditions' style={{width: '110px'}} onClick={handleStatus} />
            { showDialog &&
                <Dialog header='Conditions' visible={showDialog} onHide={() => handleStatus()} style={{width: '40%'}}>
                    {Object.entries(conditions).map(([key, value]) => {
                        return (
                            <div className='col-12 grid grid-nogutter mt-2' key={key}>
                                <Condition 
                                    conditionId={key} 
                                    condition={value}
                                    metadata={metadata}
                                    conditionMapper={conditionMapper}
                                    setConditions={setConditions}
                                    addCondition={addCondition}
                                    deleteCondition={deleteCondition}
                                />
                            </div>
                        )
                    })}
          
                </Dialog>
            }
        </>
    )
}



