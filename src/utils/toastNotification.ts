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
    | 'notAllowed'
    | 'standard error'
    | 'start date valid range'
    | 'end date valid range'
    | 'notLoggedIn'

const messages = {
    'end date before start date':
        'De datum van uitwerkingtreding mag niet eerder zijn dan de datum van inwerkingtreding',
    saved: 'Opgeslagen',
    'connection added': 'Koppeling toegevoegd',
    'connection modified': 'Koppeling gewijzigd',
    'connection deleted': 'Koppeling verwijderd',
    'status changed': 'Status gewijzigd',
    notAllowed: 'Je hebt geen toegang tot deze pagina',
    notLoggedIn: 'Voor deze actie moet je ingelogd zijn',
    'standard error': process.env.REACT_APP_ERROR_MSG,
    'start date valid range': 'Vul een inwerkingtreding in tussen 1990 en 2100',
    'end date valid range': 'Vul een uitwerkingtreding in tussen 1990 en 2100',
}

const toastNotification = ({ type }: { type: Type }) => {
    toast(messages[type])
}

export { toastNotification }
