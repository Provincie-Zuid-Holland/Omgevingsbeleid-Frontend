interface ContentTekstProps {
    titel?: string
    content: string
}

const ContentTekst = ({ titel, content }: ContentTekstProps) => (
    <div className="mt-6 text-gray-800">
        {titel && <h2 className="block mb-3 text-lg">{titel}</h2>}
        <p>{content}</p>
    </div>
)

export default ContentTekst
