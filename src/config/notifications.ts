export type ToastType =
    | 'saved'
    | 'error'
    | 'notAllowed'
    | 'passwordReset'
    | 'notLoggedIn'
    | 'unauthorized'
    | 'moduleCreated'
    | 'moduleActivate'
    | 'moduleEdit'
    | 'moduleLocked'
    | 'moduleUnlocked'
    | 'moduleClosed'
    | 'moduleCompleted'
    | 'objectRemoved'
    | 'acknowledgedRelationSaved'
    | 'acknowledgedRelationPatched'
    | 'acknowledgedRelationDisconnected'

type MessageType = 'default' | 'success' | 'error' | 'warning' | 'info'

export const notifications: Record<
    ToastType,
    { message: string; type: MessageType }
> = {
    saved: { message: 'Opgeslagen', type: 'success' },
    error: {
        message: import.meta.env.VITE_ERROR_MSG || '',
        type: 'error',
    },
    notAllowed: {
        message: 'Je hebt geen toegang tot deze pagina',
        type: 'warning',
    },
    passwordReset: {
        message: 'Wachtwoord succesvol gewijzigd',
        type: 'success',
    },
    notLoggedIn: {
        message: 'Voor deze actie moet je ingelogd zijn',
        type: 'info',
    },
    unauthorized: {
        message: 'Je hebt niet de juiste rechten voor deze actie',
        type: 'info',
    },
    moduleCreated: {
        message: 'De module is aangemaakt',
        type: 'success',
    },
    moduleEdit: {
        message: 'De module is aangepast',
        type: 'success',
    },
    moduleActivate: {
        message: 'De module is geactiveerd',
        type: 'success',
    },
    moduleLocked: {
        message: 'De module is op slot',
        type: 'success',
    },
    moduleUnlocked: {
        message: 'De module is ontgrendeld',
        type: 'success',
    },
    moduleClosed: {
        message: 'De module is verwijderd',
        type: 'success',
    },
    moduleCompleted: {
        message: 'De module is afgesloten',
        type: 'success',
    },
    objectRemoved: {
        message: 'Het object is verwijderd',
        type: 'success',
    },
    acknowledgedRelationSaved: {
        message: 'Verzoek tot beleidsrelatie is verzonden',
        type: 'success',
    },
    acknowledgedRelationPatched: {
        message: 'De beleidsrelatie is gewijzigd',
        type: 'success',
    },
    acknowledgedRelationDisconnected: {
        message: 'De beleidsrelatie is verbroken',
        type: 'success',
    },
}
