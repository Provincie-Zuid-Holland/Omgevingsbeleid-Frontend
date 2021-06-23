import { toast } from 'react-toastify'

const errorMessages = {
    'Image filesize larger than 1MB in text':
        'De afbeelding is te groot (Max. 1MB)',
    'Image width larger than 800px in text':
        'De afbeelding is te groot (800x600)',
}

/**
 * Function to handle error object we receive back from the API
 * @param {Object} error - The error object
 */
const handleError = (error) => {
    if (!error.response) return

    const response = error.response

    if (response.status === 400) {
        const errors = response.data.errors

        // handle each error
        Object.keys(errors).forEach((property) => {
            const notificationText = errorMessages[errors[property]]

            if (notificationText) {
                toast(notificationText)
            } else {
                console.error(error)
                toast(process.env.REACT_APP_ERROR_MSG)
            }
        })
    } else {
        console.error(error)
        toast(process.env.REACT_APP_ERROR_MSG)
    }
}

export default handleError
