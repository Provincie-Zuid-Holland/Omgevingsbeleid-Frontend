import { cn } from '@pzh-ui/components'

interface IndicatorProps {
    amount?: number
    hasNotification?: boolean
}

const Indicator = ({ amount = 0, hasNotification }: IndicatorProps) => (
    <div
        className={cn(
            'relative flex h-6 w-6 items-center justify-center rounded-full border',
            {
                'after:content-[" "] border-pzh-blue-500 bg-pzh-blue-500 text-pzh-white after:absolute after:-left-1 after:-top-1 after:h-3 after:w-3 after:rounded-full after:border after:border-pzh-white after:bg-pzh-red-500':
                    hasNotification,
                'border-pzh-blue-100 bg-pzh-blue-10 text-pzh-blue-500':
                    !hasNotification,
            }
        )}>
        <span className="-mb-1 text-s font-bold">{amount}</span>
    </div>
)

export default Indicator
