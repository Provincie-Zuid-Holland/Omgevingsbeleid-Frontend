import classNames from 'classnames'
import { useState } from 'react'

interface DropAreaProps {
    onDrop: () => void
    position: 'top' | 'bottom'
}

const DropArea = ({ onDrop, position }: DropAreaProps) => {
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
                'after:content-[` `] absolute left-0 z-1 h-2 w-full py-2 transition-[opacity] after:absolute after:h-[4px] after:w-full after:animate-pulse after:bg-pzh-blue-light',
                {
                    '-top-2 after:top-[8px]': position === 'top',
                    '-bottom-2 after:bottom-[8px]': position === 'bottom',
                    'opacity-100': isVisible,
                    'opacity-0': !isVisible,
                }
            )}
        />
    )
}

export default DropArea
