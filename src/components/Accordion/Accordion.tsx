import classNames from 'classnames'
import { ReactNode } from 'react'

interface AccordionProps {
    className?: string
    children: ReactNode | ReactNode[]
    isDraggable?: boolean
}

const Accordion = ({ className, children }: AccordionProps) => {
    return <ul className={className}>{children}</ul>
}

const AccordionItem = ({
    isDraggable,
    className,
    children,
}: AccordionProps) => {
    return (
        <li
            className={classNames(
                'relative flex items-center justify-between border-b border-pzh-gray-200 py-2',
                className
            )}>
            <div className="flex items-center">
                <GripDotsVertical size={16} className="mr-3 text-pzh-blue" />
                <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] bg-pzh-warm-gray-light">
                    <Heading size={14} className="text-pzh-white" />
                </div>
                <Text className="-mb-1 ml-3" color="text-pzh-blue">
                    Hoofdstuk 1: Adequaat aanbod openbaar vervoer
                </Text>
            </div>
            <button className="after:content-[' '] after:absolute after:left-0 after:top-0 after:h-full after:w-full">
                <AngleDown size={16} className="text-pzh-blue" />
            </button>
        </li>
    )
}

export { Accordion }
