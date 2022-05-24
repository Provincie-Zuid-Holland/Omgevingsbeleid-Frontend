import ColoredBall from '@/components/ColoredBall'
import LineIndicatorLeftToRight from '@/components/LineIndicatorLeftToRight'
import LineIndicatorRightToLeft from '@/components/LineIndicatorRightToLeft'

const LineIndicatorArchived = () => (
    <div className="relative pl-6 -mt-4">
        <div className="flex items-center border-l-2 border-pzh-green-light">
            <div>
                <LineIndicatorRightToLeft />
                <span className="block h-2" />
                <LineIndicatorLeftToRight />
            </div>
            <div className="relative flex -ml-2" style={{ left: '1.75px' }}>
                <ColoredBall color="red" />
                <ColoredBall color="red" className="ml-1 opacity-50" />
                <ColoredBall color="red" className="ml-2 opacity-25" />
            </div>
        </div>
    </div>
)

export default LineIndicatorArchived
