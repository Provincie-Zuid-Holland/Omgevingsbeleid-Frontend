export type ToastType =
    | 'saved'
    | 'error'
    | 'error441'
    | 'error442'
    | 'error443'
    | 'error444'
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
    | 'userCreated'
    | 'userActivated'
    | 'userDeactivated'
    | 'userPasswordGenerated'
    | 'templateActivated'
    | 'templateDeactivated'

type MessageType = 'default' | 'success' | 'error' | 'warning' | 'info'

export const notifications: Record<
    ToastType,
    { message: string; type: MessageType }
> = {
    saved: { message: 'Opgeslagen', type: 'success' },
    error: {
        message: 'Er is iets misgegaan, probeer het later nog eens',
        type: 'error',
    },
    error441: {
        message:
            'Er is iets misgegaan in de validatie, bekijk je console voor de technische details',
        type: 'error',
    },
    error442: {
        message:
            'Er is iets misgegaan in de DSO, bekijk je console voor de technische details',
        type: 'error',
    },
    error443: {
        message:
            'Er is iets misgegaan in de renvooi, bekijk je console voor de technische details',
        type: 'error',
    },
    error444: {
        message:
            'Er is iets misgegaan PDF export, bekijk je console voor de technische details',
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
    userCreated: {
        message: 'De gebruiker is aangemaakt',
        type: 'success',
    },
    userActivated: {
        message: 'De gebruiker is geactiveerd',
        type: 'success',
    },
    userDeactivated: {
        message: 'De gebruiker is gedeactiveerd',
        type: 'success',
    },
    userPasswordGenerated: {
        message: 'Het nieuwe wachtwoord voor de gebruiker is opgeslagen',
        type: 'success',
    },
    templateActivated: {
        message: 'De template is geactiveerd',
        type: 'success',
    },
    templateDeactivated: {
        message: 'De template is gedeactiveerd',
        type: 'success',
    },
}
