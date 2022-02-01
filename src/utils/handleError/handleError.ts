import { toast } from 'react-toastify'

const errorMessages = {
    'Image filesize larger than 1MB in text':
        'De afbeelding is te groot (Max. 1MB)',
    'Image width larger than 800px in text':
        'De afbeelding is te groot (800x600)',
}

const standardError = (error?: any) => {
    if (error) {
        console.error(error)
    }
    toast(process.env.REACT_APP_ERROR_MSG)
}

/**
 * Function to handle error object we receive back from the API
 * @param {Object} error - The error object
 */
const handleError = (error: any) => {
    if (!error || !error.response) return

    const response = error.response

    // 400 Bad Request
    if (response.status === 400) {
        const errors = response?.data?.errors

        if (!errors) {
            standardError()
            return
        }

        // handle each error
        Object.keys(errors).forEach(property => {
            const errorVal = errors[property] as keyof typeof errorMessages
            const notificationText = errorMessages[errorVal]

            if (notificationText) {
                toast(notificationText)
            } else {
                standardError(error)
            }
        })
    } else {
        standardError(error)
    }
}

export default handleError
