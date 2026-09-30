import { BadgeProps } from '@pzh-ui/components'
import { CircleCheckSolid, CircleXmark, ClockRotateLeft } from '@pzh-ui/icons'

import clsx from 'clsx'

/**
 * Returns indicator class based on isSucceeded param
 */
export const getIndicatorClass = (isSucceeded?: boolean) =>
    clsx(
        'after:content-[` `] flex h-[19px] min-w-[19px] w-[19px] items-center justify-center rounded-full border',
        {
            'after:block after:h-[13px] after:w-[13px] after:rounded-full after:bg-pzh-green-500 border-pzh-gray-600':
                !isSucceeded,
            'border-pzh-green-500 bg-pzh-green-500': isSucceeded,
        }
    )

export const getPackageStatus = (status?: string): BadgeProps | undefined => {
    switch (status) {
        case 'pending':
            return {
                text: 'In afwachting',
                variant: 'yellow',
            }
        case 'valid':
            return {
                text: 'Geslaagd',
                variant: 'green',
            }
        case 'failed':
            return {
                text: 'Mislukt',
                variant: 'red',
            }
        case 'aborted':
            return {
                text: 'Afgebroken',
                variant: 'red',
            }
    }
}

export const getPackageStatusIcon = (status?: string) => {
    const { icon, className } =
        status === 'valid'
            ? { icon: CircleCheckSolid, className: 'text-pzh-green-500' }
            : status === 'failed' || status === 'aborted'
              ? { icon: CircleXmark, className: 'text-pzh-red-500' }
              : { icon: ClockRotateLeft, className: 'text-pzh-yellow-500' }

    return {
        icon,
        className,
        label: getPackageStatus(status)?.text ?? 'In afwachting',
    }
}

export const getReportStatus = (status?: string): BadgeProps | undefined => {
    switch (status) {
        case 'pending':
            return {
                text: 'In afwachting',
                variant: 'yellow',
            }
        case 'valid':
            return {
                text: 'Goedgekeurd',
                variant: 'green',
            }
        case 'failed':
            return {
                text: 'Gefaald',
                variant: 'red',
            }
        case 'aborted':
            return {
                text: 'Afgebroken',
                variant: 'red',
            }
    }
}
