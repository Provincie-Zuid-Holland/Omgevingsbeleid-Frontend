export interface RevisionOverviewTitleProps {
    title: string
}

/**
 * Displays a title containing html markup.
 */
const RevisionOverviewTitle = ({ title }: RevisionOverviewTitleProps) => (
    <h2
        className="mt-2 text-2xl font-semibold text-primary-super-dark"
        dangerouslySetInnerHTML={{ __html: title }}
    />
)
export default RevisionOverviewTitle
