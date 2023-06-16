import CryptoJS from "crypto-js"

const useUtilityFunctions = () => {
  const createUserFriendlyId = (id, formType) => {
    const combinedString = formType + id

    const hash = CryptoJS.SHA256(combinedString)

    const hashString = hash.toString()

    const alphanumericValue = hashString.substring(0, 6).toUpperCase()

    const formTypeInitials = type => {
      const words = type.split(/[\s\-]/)
      const acronym = words.map(word => word.charAt(0)).join('')
      return acronym.toUpperCase()
    }

    return formTypeInitials(formType) + '-' + alphanumericValue
  }

  const createUserFriendlyDate = (oldDate) => {
    const newDate = new Date(oldDate)
    const year = newDate.getFullYear()
    const month = String(newDate).slice(4, 7)
    const day = String(newDate.getDate()).padStart(2, '0')
    const hours = String(newDate.getHours()).padStart(2, '0')
    const minutes = String(newDate.getMinutes()).padStart(2, '0')
    const seconds = String(newDate.getSeconds()).padStart(2, '0')
    const formattedDateString = newDate.toLocaleString('en-US', { timeZoneName: 'short' })
    return `${day}-${month}-${year} ${Number(hours) > 12 ? Number(hours) - 12 : hours}:${minutes}:${seconds} ${Number(hours) > 12 ? 'PM' : 'AM'} ${formattedDateString.substring(formattedDateString.length - 3)}`
  }

  return { createUserFriendlyId, createUserFriendlyDate }
}

export default useUtilityFunctions