export interface RevisionOverviewTextProps {
    textContent?: string
    label: string
}

const RevisionOverviewText = ({
    textContent,
    label,
}: RevisionOverviewTextProps) => (
    <div className="mb-8">
        {label ? (
            <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                {label}
            </h3>
        ) : null}
        <p
            className={`text-gray-800 leading-7 break-words w-full whitespace-pre-line`}
            dangerouslySetInnerHTML={{
                __html: textContent || 'Er is geen inhoud',
            }}
        />
    </div>
)

export default RevisionOverviewText
