const ViewFieldTags = ({
    fieldValue = [],
}: {
    fieldValue: { value: string }[]
}) => {
    if (!fieldValue) return null

    return (
        <div className="mt-8">
            <h2 className="block mb-2 text-lg tracking-wide text-gray-700">
                Tags
            </h2>
            <div className="flex mt-3">
                {fieldValue.map(item => (
                    <div
                        key={item.value}
                        className="px-4 py-2 mr-4 text-sm text-gray-700 bg-gray-300 rounded">
                        {item.value}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ViewFieldTags
