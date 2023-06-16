import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import React from 'react'
import Header from '../Header/Header'

import styles from '../Action/Action.module.css'
import conditionStyles from '../Condition/Condition.module.css'


export default function Action({guid, conditionId, action, allFields, setConditions}) {
    const updateAction = (actionId, updatedAction) => {
        setConditions(prevConditions => ({
            ...prevConditions,
            [conditionId]: {
                ...prevConditions[conditionId],
                actions: {
                    ...prevConditions[conditionId].actions,
                    [actionId]: updatedAction
                }
            }
        }))
    }

    const deleteAction = (actionId) => {
        setConditions(prevConditions => {
            const conditionActions = prevConditions[conditionId].actions;

            if (Object.keys(conditionActions).length === 1) {
                return prevConditions
            }

            const newActions = { ...prevConditions[conditionId].actions }
            delete newActions[actionId]

            return {
                ...prevConditions,
                [conditionId]: {
                    ...prevConditions[conditionId],
                    actions: newActions
                }
            }
        })
    }

    return (
        <div className={`col-12 grid grid-nogutter ${styles.background}`}>
            <Header label='Do' />
            <Dropdown
                className='col-8 mt-2'
                value={action.rule}
                onChange={(e) => updateAction(guid, {...action, rule: e.value})}
                options={[
                    {label: 'Show', value: 'Show'},
                    {label: 'Hide', value: 'Hide'},
                    {label: 'Disable', value: 'Disable'},
                    {label: 'Enable', value: 'Enable'}
                ]}
            />
            <Header label='Field(s)' />
            <MultiSelect
                className='col-8 mt-2'
                options={allFields}
                value={action.fields}
                onChange={(e) => updateAction(guid, {...action, fields: e.value})}
            />
            <i className={`col-12 mt-1 pi pi-trash ${conditionStyles.deleteButton}`} onClick={() => deleteAction(guid)}></i>
        </div>
    )
}
