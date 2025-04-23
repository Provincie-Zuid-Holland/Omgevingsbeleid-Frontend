import classNames from 'clsx'
import { useState } from 'react'

interface DropAreaProps {
    onDrop: () => void
    position: 'top' | 'bottom'
    className?: string
}

const DropArea = ({ onDrop, position, className }: DropAreaProps) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            onDragEnter={() => setIsVisible(true)}
            onDragLeave={() => setIsVisible(false)}
            onDrop={() => {
                onDrop()
                setIsVisible(false)
            }}
            onDragOver={ev => ev.preventDefault()}
            className={classNames(
                'after:content-[` `] absolute left-0 z-[1] h-2 w-full py-2 transition-[opacity] after:absolute after:h-1 after:w-full after:animate-pulse after:bg-pzh-blue-100',
                {
                    '-top-2 after:top-2': position === 'top' && !className,
                    '-bottom-2 after:bottom-2':
                        position === 'bottom' && !className,
                    'opacity-100': isVisible,
                    'opacity-0': !isVisible,
                },
                className
            )}
        />
    )
}

export default DropArea
