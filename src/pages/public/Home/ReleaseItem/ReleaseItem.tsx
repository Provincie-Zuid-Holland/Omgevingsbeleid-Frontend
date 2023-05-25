import { Heading } from '@pzh-ui/components'

interface ReleaseItemProps {
    date: string
    releaseNumber: string
    releaseNote: string
}

const ReleaseItem = ({
    date,
    releaseNumber,
    releaseNote,
}: ReleaseItemProps) => (
    <>
        <span className="flex justify-start col-span-4 pt-0 mt-8 opacity-50 md:pt-6 md:justify-end md:col-span-1 md:mt-0">
            {date}
        </span>
        <div className="col-span-4 p-6 bg-white/20 rounded md:col-span-3">
            <Heading level="3" color="text-white">
                Release {releaseNumber}
            </Heading>
            <span>{releaseNote}</span>
        </div>
    </>
)

export default ReleaseItem
