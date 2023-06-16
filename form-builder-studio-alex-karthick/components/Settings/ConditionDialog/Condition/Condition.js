import React, { useMemo } from 'react'
import Expression from '../Expression/Expression'
import Action from '../Action/Action'
import { Guid } from 'js-guid'

import styles from './Condition.module.css'
import { Button } from 'primereact/button'

export default function Condition({conditionId, condition, setConditions, metadata, conditionMapper, addCondition, deleteCondition}) {

    const ifFields = useMemo(() => {
        const fields = []
        for (const [key, value] of Object.entries(metadata ?? {})) {
            const { label, type } = value
            if (type in conditionMapper) {
                fields.push({label: label, value: key})
            }
        }

        return fields
    }, [metadata, conditionMapper])

    const allFields = useMemo(() => {
        const fields = []
        for (const [key, value] of Object.entries(metadata ?? {})) {
            const { name } = value
            fields.push({ label: name, value: key })
        }

        return fields
    }, [metadata])

    const addAction = (conditionId) => {
        setConditions(prevConditions => ({
            ...prevConditions,
            [conditionId]: {
                ...prevConditions[conditionId],
                actions: {
                    ...prevConditions[conditionId].actions,
                    [Guid.newGuid().StringGuid]: {
                        rule: undefined,
                        fields: []
                    }
                }
            }
        }))
    }

    const addExpression = () => {
        setConditions(prevConditions => ({
            ...prevConditions,
            [conditionId]: {
                ...prevConditions[conditionId],
                expressions: {
                    ...prevConditions[conditionId].expressions,
                    [Guid.newGuid().StringGuid]: {
                        field: undefined,
                        rule: undefined,
                        value: undefined
                    } 
                }
            }
        }))
    }

    return (
        <>
            <div className={`grid grid-nogutter mt-2 ${styles.background}`}>
                <div className={`col-12 ${styles.addButton}`}>Condition</div>
                { Object.entries(condition?.expressions).map(([key, value]) => {
                    return (
                        <div key={key} className='col-12 grid grid-nogutter mt-4'>
                            <Expression
                                guid={key} 
                                conditionId={conditionId}
                                setConditions={setConditions}
                                expression={value} 
                                conditionMapper={conditionMapper}
                                metadata={metadata}
                                ifFields={ifFields}
                            />
                        </div>
                    )
                })}
                <div className={`${styles.buttonContainer}`} >
                    <Button label='Add Expression' onClick={() => addExpression()} />
                </div>
                { Object.entries(condition?.actions).map(([key, value]) => {
                    return (
                        <div key={key} className='col-12 grid grid-nogutter mt-4'>
                            <Action
                                guid={key}
                                conditionId={conditionId}
                                setConditions={setConditions}
                                action={value}
                                metadata={metadata}
                                allFields={allFields}
                            />
                        </div>      
                    )
                })}
                <div className={`${styles.buttonContainer}`} >
                    <Button label='Add Action' onClick={() => addAction(conditionId)} />
                </div>
            </div>
            <i className={`col-12 mt-3 pi pi-trash ${styles.deleteButton}`} onClick={() => deleteCondition(conditionId)}></i>
            <div className={`${styles.buttonContainer}`}>
                <Button label='Add Condition' onClick={() => addCondition()}/>
            </div>
        </>
    ) 
}
