export default function useDialogValidations() {
    const invalidDefaultValues = (options) => {
        for (const option of options) {
          if (option.label === '' || option.value === '') {
            return true
          }
        }
    
        const values = options.map(option => option.value)
    
        if (new Set(values).size !== values.length) { // new Set(labels).size !== labels.length || 
          // The Set object automatically removes duplicates so if the size of the Set is smaller than
          // the length of either labels or values then we know there are duplicates.
          return true
        } else {
          return false
        }
      }

      return { invalidDefaultValues }
}