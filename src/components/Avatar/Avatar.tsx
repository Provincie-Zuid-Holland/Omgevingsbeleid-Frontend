import { Tooltip } from '@pzh-ui/components'
import classNames from 'classnames'

interface AvatarProps {
    name: string
    prefix?: string
    className?: string
    isSmall?: boolean
}

const Avatar = ({ name, prefix, className, isSmall }: AvatarProps) => {
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
    const match = [...name.matchAll(rgx)] || []
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
                    'flex cursor-pointer items-center justify-center rounded-full bg-pzh-blue',
                    {
                        'h-10 w-10 text-s': isSmall,
                        'h-[46px] w-[46px]': !isSmall,
                    },
                    className
                )}>
                <span className="-mb-1 font-bold text-white">{initials}</span>
            </div>
        </Tooltip>
    )
}

export default Avatar
