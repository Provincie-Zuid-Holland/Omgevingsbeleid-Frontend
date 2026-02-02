import { BadgeProps } from '@pzh-ui/components'
import clsx from 'clsx'

/**
 * Returns indicator class based on isSucceeded param
 */
export const getIndicatorClass = (isSucceeded?: boolean) =>
    clsx(
        'after:content-[` `] flex h-[19px] w-[19px] items-center justify-center rounded-full border',
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
