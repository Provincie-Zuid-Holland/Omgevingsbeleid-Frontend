function ViewFieldGebiedDuiding({
    gebiedDuiding,
}: {
    gebiedDuiding?: string | null
}) {
    if (!gebiedDuiding) return null

    return (
        <div className="mb-8">
            <p
                className={`text-gray-700 text-sm mt-1 leading-7 break-words w-full whitespace-pre-line`}>
                {gebiedDuiding
                    ? 'Intentie werkingsgebied: ' + gebiedDuiding.toLowerCase()
                    : null}
            </p>
        </div>
    )
}

export default ViewFieldGebiedDuiding
