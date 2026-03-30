import { cn } from '@pzh-ui/components'

interface IndicatorProps {
    amount?: number
    hasNotification?: boolean
    className?: string
}

const Indicator = ({
    amount = 0,
    hasNotification,
    className,
}: IndicatorProps) => (
    <div
        className={cn(
            'relative flex h-6 w-6 items-center justify-center rounded-full border',
            {
                'after:content-[" "] border-pzh-blue-500 bg-pzh-blue-500 text-pzh-white after:border-pzh-white after:bg-pzh-red-500 after:absolute after:-top-1 after:-left-1 after:h-3 after:w-3 after:rounded-full after:border':
                    hasNotification,
                'border-pzh-blue-100 bg-pzh-blue-10 text-pzh-blue-500':
                    !hasNotification,
            },
            className
        )}>
        <span className="text-s -mb-px font-bold" aria-live="polite">
            {amount}
            <span className="sr-only"> filters geselecteerd</span>
        </span>
    </div>
)

export default Indicator
