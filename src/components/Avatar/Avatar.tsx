import { Tooltip } from '@pzh-ui/components'

import classNames from 'clsx'

import useUserInfo from '@/hooks/useUserInfo'

interface AvatarProps {
    id: string
    prefix?: string
    className?: string | null
    isSmall?: boolean
}

const Avatar = ({ id, prefix, className, isSmall }: AvatarProps) => {
    const { name = '' } = useUserInfo(id) || {}

    const rgx = new RegExp(/(\p{L}{1})\p{L}+/gu)
    const match = [...name.matchAll(rgx)]
    const initials = (
        (match.shift()?.[1] || '') + (match.pop()?.[1] || '')
    ).toUpperCase()

    return (
        <Tooltip
            label={
                prefix ? (
                    <p>
                        <span className="text-s font-bold">{prefix}:</span>
                        <br />
                        {name}
                    </p>
                ) : (
                    name
                )
            }>
            <div
                className={classNames(
                    'flex cursor-pointer items-center justify-center rounded-full bg-pzh-blue-500',
                    {
                        'h-10 w-10 text-s': isSmall,
                        'h-11.5 w-11.5': !isSmall,
                    },
                    className
                )}>
                <span className="-mb-1 font-bold text-pzh-white">
                    {initials}
                </span>
            </div>
        </Tooltip>
    )
}

export default Avatar
