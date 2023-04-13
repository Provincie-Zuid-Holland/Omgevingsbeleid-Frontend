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
                        <span className="text-sm font-bold">{prefix}:</span>
                        <br />
                        {name}
                    </p>
                ) : (
                    name
                )
            }>
            <div
                className={classNames(
                    'flex items-center justify-center rounded-full bg-pzh-blue cursor-pointer',
                    {
                        'w-8 h-8 text-[16px]': isSmall,
                        'w-[46px] h-[46px]': !isSmall,
                    },
                    className
                )}>
                <span className="-mb-[4px] font-bold text-white">
                    {initials}
                </span>
            </div>
        </Tooltip>
    )
}

export default Avatar
