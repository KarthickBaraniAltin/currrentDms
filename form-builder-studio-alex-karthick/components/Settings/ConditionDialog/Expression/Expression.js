import { Dropdown } from 'primereact/dropdown'
import React, { createElement } from 'react'
import Header from '../Header/Header'
import ViewComponentsContainer from '../../../ViewComponents/ViewComponents/ViewComponentContainer/ViewComponentContainer'

import styles from '../Expression/Expression.module.css'
import conditionStyles from '../Condition/Condition.module.css'

export default function Expression({guid, conditionId, expression, metadata, setConditions, ifFields, conditionMapper}) {

    const getRuleOptions = () => {
        const options = []
        const { field } = expression

        if (!metadata[field]) {
            return options
        }

        const { type } = metadata[field] 
        if (field && type && conditionMapper[type].rules) {
            Object.entries(conditionMapper[type].rules).forEach(([key, value]) => { 
                options.push({label: key, value: value })
            })
        }
        
        return options
    }

    const displayValueSection = () => {
        if (!expression || !expression.field || !expression.rule) {
            return false
        }

        const { showValueSelector } = expression.rule
        if (showValueSelector == undefined) {
            return true
        } else {
            return showValueSelector
        }
    }

    const handleValueChange = (value) => {
        updateExpression(guid, {...expression, val: value})
    }

    const updateExpression = (expressionId, expression) => {
        setConditions(prevConditions => ({
            ...prevConditions,
            [conditionId]: {
                ...prevConditions[conditionId],
                expressions: {
                    ...prevConditions[conditionId].expressions,
                    [expressionId]: {...expression}
                }
            }
        }))
    }

    const deleteExpression = (expressionId) => {
        setConditions(prevConditions => {
            const conditionExpressions = prevConditions[conditionId].expressions

            if (Object.keys(conditionExpressions).length === 1) {
                return prevConditions
            }

            const newExpressions = { ...prevConditions[conditionId].expressions }
            delete newExpressions[expressionId]

            return {
                ...prevConditions,
                [conditionId]: {
                    ...prevConditions[conditionId],
                    expressions: newExpressions
                }
            }
        })
    }

    return (
        <div className={`col-12 grid grid-nogutter ${styles.background}`}>
            <Header label='If' />
            <Dropdown 
                className={`col-8 mt-2`}
                value={expression?.field ?? ''} 
                onChange={(e) => updateExpression(guid, { field: e.value })}
                options={ifFields}
                placeholder='Select Field'
                filter
            />
            <div className='col-12 grid grid-nogutter'>
                <Header label='Rule' />
                <Dropdown
                    className='col-8 mt-2'
                    disabled={!expression?.field}
                    value={expression?.rule ?? ''}
                    onChange={(e) => updateExpression(guid, {...expression, rule: {...e.value}})}
                    options={getRuleOptions(expression.field)}
                    placeholder='Select Rule'
                />
            </div>
            <div className='col-12 grid grid-nogutter'>
                { displayValueSection() && 
                    <>
                        <div className='col-4 mt-2' style={{fontWeight: '700', fontSize: '20px'}}>Value</div>
                        <ViewComponentsContainer key={expression.field} className='field col-8'>
                            {
                                createElement(
                                    conditionMapper[metadata[expression.field].type].component,
                                    {
                                        className: 'col-12 mt-2',
                                        name: metadata[expression.field].name,
                                        metadata: metadata[expression.field],
                                        value: expression.val,
                                        errors: undefined,
                                        onChange: handleValueChange
                                    }
                                )
                            }
                        </ViewComponentsContainer>
                    </>
                }
            </div>
            <i className={`col-12 mt-1 pi pi-trash ${conditionStyles.deleteButton}`} onClick={() => deleteExpression(guid)}></i>
        </div>
    )
}
