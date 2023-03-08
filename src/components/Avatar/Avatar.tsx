import { Tooltip } from '@pzh-ui/components'
import classNames from 'classnames'

interface AvatarProps {
    name: string
    className?: string
}

const Avatar = ({ name, className }: AvatarProps) => (
    <Tooltip label={name}>
        <div
            className={classNames(
                'flex items-center justify-center rounded-full border border-pzh-gray-600 bg-pzh-blue w-[46px] h-[46px] cursor-pointer',
                className
            )}>
            <span className="-mb-1 text-xl font-bold text-white">
                {name.substring(0, 1).toUpperCase()}
            </span>
        </div>
    </Tooltip>
)

export default Avatar
