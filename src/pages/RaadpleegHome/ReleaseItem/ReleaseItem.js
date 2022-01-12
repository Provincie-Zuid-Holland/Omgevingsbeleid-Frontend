import Heading from './../../../components/Heading'

const ReleaseItem = ({ date, releaseNumber, releaseNotes = [] }) => (
    <>
        <span className="flex justify-start col-span-4 pt-0 mt-8 opacity-50 md:pt-6 md:justify-end md:col-span-1 md:mt-0">
            {date}
        </span>
        <div className="col-span-4 p-6 bg-white rounded md:col-span-3 bg-opacity-20">
            <Heading level="3" color="text-white">
                Release {releaseNumber}
            </Heading>
            <ul className="pl-4 list-disc list-outside">
                {releaseNotes.map(note => (
                    <li key={note}>{note}</li>
                ))}
            </ul>
        </div>
    </>
)

export default ReleaseItem
