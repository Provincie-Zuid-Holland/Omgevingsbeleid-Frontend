import { toastNotification as toast } from '@pzh-ui/components'

import { notifications, ToastType } from '@/config/notifications'

/**
 * Function to centralize toast notifications
 */

const toastNotification = (type: ToastType) => {
    toast(notifications[type].message, { type: notifications[type].type })
}

export { toastNotification }
