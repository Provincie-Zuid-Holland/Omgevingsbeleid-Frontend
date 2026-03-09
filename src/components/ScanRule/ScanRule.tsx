import { cn, Text } from '@pzh-ui/components'
import {
    ArrowUpRightFromSquare,
    CircleInfoSolid,
    CircleXmark,
} from '@pzh-ui/icons'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

interface ScanRuleProps {
    severity?: string
    title: string
    link?: string
    messages: string[]
}

const ScanRule = ({
    severity = 'error',
    title,
    link,
    messages,
}: ScanRuleProps) => {
    const icon =
        severity === 'error' ? (
            <CircleXmark size={16} className="text-pzh-red-500 min-w-4" />
        ) : (
            <CircleInfoSolid
                size={16}
                className="text-pzh-orange-500 min-w-4"
            />
        )

    return (
        <div
            className={cn('w-full rounded-lg border px-4 py-3', {
                'border-pzh-red-500 bg-pzh-red-10': severity === 'error',
                'border-pzh-orange-500 bg-pzh-orange-500/10':
                    severity !== 'error',
            })}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-2">
                    <div className="flex-shrink-0">{icon}</div>

                    <div className="-mt-1.5 min-w-0">
                        {!!link ? (
                            <Link
                                to={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pzh-blue-500 hover:text-pzh-green-500 inline-flex items-center gap-2 font-bold"
                                title={title}>
                                <span className="truncate">{title}</span>
                                <ArrowUpRightFromSquare size={16} />
                            </Link>
                        ) : (
                            <Text bold className="text-pzh-blue-500">
                                {title}
                            </Text>
                        )}

                        <ul className="text-pzh-blue-500 mt-1 flex flex-col gap-1">
                            {messages.map(m => (
                                <li
                                    key={uuidv4()}
                                    className="text-s flex pl-2 before:relative before:top-2 before:mr-2 before:text-4xl before:leading-1 before:content-['·']">
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScanRule
