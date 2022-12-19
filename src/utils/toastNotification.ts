import { toast } from 'react-toastify'

/**
 * Function to centralize toast notifications
 * @param {object} props
 * @param {string} props.type - Contains the notification type
 */

type Type =
    | 'end date before start date'
    | 'saved'
    | 'connection added'
    | 'connection modified'
    | 'connection deleted'
    | 'status changed'
    | 'user is not authenticated for this page'
    | 'standard error'
    | 'start date valid range'
    | 'end date valid range'
    | 'user is not logged in'

const messages = {
    'end date before start date':
        'De datum van uitwerkingtreding mag niet eerder zijn dan de datum van inwerkingtreding',
    saved: 'Opgeslagen',
    'connection added': 'Koppeling toegevoegd',
    'connection modified': 'Koppeling gewijzigd',
    'connection deleted': 'Koppeling verwijderd',
    'status changed': 'Status gewijzigd',
    'user is not authenticated for this page':
        'Je bent niet geauthenticeerd om deze pagina te bekijken',
    'user is not logged in': 'Log in om deze pagina te bekijken',
    'standard error': process.env.REACT_APP_ERROR_MSG,
    'start date valid range': 'Vul een inwerkingtreding in tussen 1990 en 2100',
    'end date valid range': 'Vul een uitwerkingtreding in tussen 1990 en 2100',
}

const toastNotification = ({ type }: { type: Type }) => {
    toast(messages[type])
}

export { toastNotification }
