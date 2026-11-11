import { ToastType } from '@/config/notifications'
import { ACCESS_TOKEN_KEY, IDENTIFIER_KEY } from '@/context/AuthContext'

import globalErrorBoundary from './globalErrorBoundary'
import globalRouter from './globalRouter'
import { toastNotification } from './toastNotification'

const STATUS_TOASTS: Partial<Record<number, ToastType>> = {
    441: 'error441',
    442: 'error442',
    443: 'error443',
}

/**
 * Shared 401/403/500/[441-443] handling for both the axios interceptor
 * (api/instance.ts) and the raw-fetch download path (utils/file.ts).
 */
export const handleHttpError = (
    status: number | undefined,
    error: unknown,
    options: {
        /** Skip the 401/403 handling, e.g. for the login request itself. */
        skipAuthHandling?: boolean
        /** Extra status -> toast mappings on top of STATUS_TOASTS. */
        extraToasts?: Partial<Record<number, ToastType>>
    } = {}
) => {
    if (status === 401 && !options.skipAuthHandling) {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(IDENTIFIER_KEY)
        toastNotification('notLoggedIn')
        globalRouter.navigate?.('/login')
        return
    }

    if (status === 403 && !options.skipAuthHandling) {
        toastNotification('notAllowed')
        return
    }

    if (status === 500) {
        globalErrorBoundary.showBoundary?.(error)
        return
    }

    const toastType = status
        ? (options.extraToasts?.[status] ?? STATUS_TOASTS[status])
        : undefined

    if (toastType) {
        toastNotification(toastType)
    }
}
