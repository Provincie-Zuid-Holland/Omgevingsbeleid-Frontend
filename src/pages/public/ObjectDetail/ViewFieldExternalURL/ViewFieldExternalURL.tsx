import { ArrowUpRightFromSquare } from '@pzh-ui/icons'

const ViewFieldExternalURL = ({
    externalURL,
}: {
    externalURL?: string | null
}) => {
    if (!externalURL) return null

    // https://stackoverflow.com/questions/43803778/href-without-https-prefix
    const getClickableLink = (link: string) => {
        return link.startsWith('http://') || link.startsWith('https://')
            ? link
            : `//${link}`
    }

    return (
        <a
            href={getClickableLink(externalURL)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 text-pzh-blue hover:text-pzh-blue-dark">
            <span className="underline">Bekijk officiële publicatie</span>
            <ArrowUpRightFromSquare className="relative ml-2 -mt-[2px] inline-block" />
        </a>
    )
}

export default ViewFieldExternalURL
