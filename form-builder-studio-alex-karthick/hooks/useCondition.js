import { Guid } from 'js-guid'
import { ConditionCalendar, ConditionMask, ConditionMultiSelect, ConditionNumber, ConditionText, ConditionTextArea, ConditionTime } from '../components/ConditionComponents/ConditionComponents'
import { useMemo, useState } from 'react'

export const useCondition = ({}) => {

    const defaultCondition = {
        [Guid.newGuid().StringGuid] : {
            expressions: {
                [Guid.newGuid().StringGuid]: {
                    field: undefined,
                }
            },
            actions: {
                [Guid.newGuid().StringGuid]: {
                    rule: undefined,
                    fields: []
                }
            }
        },
    }

    const [conditions, setConditions] = useState(defaultCondition)

    const addCondition = () => {      
        setConditions({ ...conditions, ...defaultCondition })
    }

    const deleteCondition = (id) => {
        if (Object.keys(conditions).length <= 1) {
            return
        }

        const updatedConditions = { ...conditions }
        delete updatedConditions[id]
        setConditions(updatedConditions)
    }
    

    const conditionMapper = useMemo(() => {
        const filledValidation = {
            validation: 'isFilled',
            showValueSelector: false,
            expectedResult: true
        }
    
        const emptyValidation = {
            validation: 'isFilled',
            showValueSelector: false,
            expectedResult: false
        }

        return {
            text: {
                component: ConditionText,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                    'Contains': {
                        validation: 'stringContains',
                        showValueSelector: true,
                        expectedResult: true
                    },
                    'Not Contains': {
                        validation: 'stringContains',
                        showValueSelector: true,
                        expectedResult: false
                    },
                },
            },
            calendar: {
                component: ConditionCalendar,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                    'Before': {
                        validation: 'maxDate',
                        showValueSelector: true,
                        expectedResult: true
                    },
                    'After': {
                        validation: 'minDate',
                        showValueSelector: true,
                        expectedResult: true
                    },
                    'Equal': {
                        validation: 'equalDate',
                        showValueSelector: true,
                        expectedResult: true
                    }
                }
            },
            time: {
                component: ConditionTime,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                    'Before': {
                        validation: 'maxDate',
                        showValueSelector: true,
                        expectedResult: true
                    },
                    'After': {
                        validation: 'minDate',
                        showValueSelector: true,
                        expectedResult: true
                    }
                },
            },
            number: {
                component: ConditionNumber,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                    'Greater': {
                        validation: 'intBiggerThan',
                        showValueSelector: true,
                        expectedResult: true
                    },
                    'Less': {
                        validation: 'intBiggerThan',
                        showValueSelector: true,
                        expectedResult: false
                    }
                },
            },
            textarea: {
                component: ConditionTextArea,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                    'Contains': {
                        validation: 'stringContains',
                        showValueSelector: true,
                        expectedResult: true
                    },
                    'Not Contains': {
                        validation: 'stringContains',
                        showValueSelector: true,
                        expectedResult: false
                    }
                },
            },
            mask: {
                component: ConditionMask,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                },
            },
            dropdown: {
                component: ConditionMask,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                },
            },
            multiselect: {
                component: ConditionMultiSelect,
                rules: {
                    'Filled': filledValidation,
                    'Empty': emptyValidation,
                },
            },
        }
    }, [])

    return { conditionMapper, conditions, setConditions, addCondition, deleteCondition }
}
