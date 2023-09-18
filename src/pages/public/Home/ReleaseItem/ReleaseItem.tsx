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
        <span className="col-span-4 mt-8 flex justify-start pt-0 opacity-50 md:col-span-1 md:mt-0 md:justify-end md:pt-6">
            {date}
        </span>
        <div className="col-span-4 rounded bg-white/20 p-6 md:col-span-3">
            <Heading level="3" size="m" color="text-white">
                Release {releaseNumber}
            </Heading>
            <span>{releaseNote}</span>
        </div>
    </>
)

export default ReleaseItem
