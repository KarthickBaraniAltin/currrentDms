export const useConvertFormSubmission = () => {
    const convertData = (data) => {
        return Object.keys(data ?? {}).reduce((accumulator, key) => {
            if (key.startsWith('calendar') || key.startsWith('time')) { 
            // Converts data inputs for calendar and time components
                accumulator[key] = new Date(data[key])
            } else if (key.startsWith('radiobutton') || key.startsWith('checkbox') 
            || key.startsWith('dropdown') || key.startsWith('multiselect')) {
            // Converts data inputs for radiobutton, checkbox, dropdown and multiselect components
                let parsedValue
                try {
                    parsedValue = JSON.parse(data[key])
                    accumulator[key] = parsedValue
                } catch (error) {
                    accumulator[key] = data[key]
                }
            } else {
              accumulator[key] = data[key]
            }
            return accumulator
        }, {})
    }
    
    return { convertData }
}