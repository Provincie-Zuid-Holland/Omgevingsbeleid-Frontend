function ViewFieldTitelEnInhoud({ fieldValue, fieldTitel }) {
    return (
        <div className="mb-8">
            <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                {fieldTitel}
            </h2>
            <p
                className={`leading-7 break-words w-full whitespace-pre-line ${
                    !fieldValue ? 'italic' : ''
                }`}
            >
                {!fieldValue ? 'Er is nog geen inhoud' : fieldValue}
            </p>
        </div>
    )
}

export default ViewFieldTitelEnInhoud
