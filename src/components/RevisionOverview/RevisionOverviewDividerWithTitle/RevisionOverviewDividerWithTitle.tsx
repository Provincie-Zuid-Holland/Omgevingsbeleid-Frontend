import RevisionOverviewContainerLeft from '@/components/RevisionOverview/RevisionOverviewContainerLeft'
import RevisionOverviewContainerRight from '@/components/RevisionOverview/RevisionOverviewContainerRight'

export interface RevisionOverviewDividerWithTitleProps {
    title: string
    singleTitle?: boolean
}

const RevisionOverviewDividerWithTitle = ({
    title,
    singleTitle,
}: RevisionOverviewDividerWithTitleProps) => {
    if (singleTitle) {
        return (
            <div className="w-full px-6 pt-5 pb-4 bg-gray-100 border-t border-b border-gray-200">
                <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                    {title}
                </h3>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap justify-between w-full px-6 pt-5 pb-4 bg-gray-100 border-t border-b border-gray-200">
            <RevisionOverviewContainerLeft>
                <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                    {title}
                </h3>
            </RevisionOverviewContainerLeft>
            <RevisionOverviewContainerRight>
                <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                    {title}
                </h3>
            </RevisionOverviewContainerRight>
        </div>
    )
}

export default RevisionOverviewDividerWithTitle
