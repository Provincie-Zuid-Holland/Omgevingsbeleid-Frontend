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

const toastNotification = ({ type }: { type: Type }) => {
    if (type === 'end date before start date') {
        toast(
            'De datum van uitwerkingtreding mag niet eerder zijn dan de datum van inwerkingtreding'
        )
    } else if (type === 'saved') {
        toast('Opgeslagen')
    } else if (type === 'connection added') {
        toast('Koppeling toegevoegd')
    } else if (type === 'connection modified') {
        toast('Koppeling gewijzigd')
    } else if (type === 'connection deleted') {
        toast('Koppeling verwijderd')
    } else if (type === 'status changed') {
        toast('Status gewijzigd')
    } else if (type === 'user is not authenticated for this page') {
        toast('Je bent niet geauthenticeerd om deze pagina te bekijken')
    } else if (type === 'standard error') {
        toast(process.env.REACT_APP_ERROR_MSG)
    } else if (type === 'start date valid range') {
        toast('Vul een inwerkingtreding in tussen 1990 en 2100')
    } else if (type === 'end date valid range') {
        toast('Vul een uitwerkingtreding in tussen 1990 en 2100')
    }
}

export { toastNotification }
