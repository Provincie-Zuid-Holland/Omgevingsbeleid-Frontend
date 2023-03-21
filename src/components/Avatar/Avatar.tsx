import { Tooltip } from '@pzh-ui/components'
import classNames from 'classnames'

interface AvatarProps {
    name: string
    className?: string
}

const Avatar = ({ name, className }: AvatarProps) => {
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
    const match = [...name.matchAll(rgx)] || []
    const initials = (
        (match.shift()?.[1] || '') + (match.pop()?.[1] || '')
    ).toUpperCase()

    return (
        <Tooltip label={name}>
            <div
                className={classNames(
                    'flex items-center justify-center rounded-full border border-pzh-gray-600 bg-pzh-blue w-[46px] h-[46px] cursor-pointer',
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
